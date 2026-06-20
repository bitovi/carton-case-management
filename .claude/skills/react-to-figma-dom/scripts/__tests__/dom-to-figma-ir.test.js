const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { isPositioningWrapper, getPositioningWrapperChild, translateNode, hasVisualContainer } = require('../dom-to-figma-ir');

function makeContext(overrides = {}) {
  return {
    variablesMap: null,
    reverseColorMap: {},
    iconsMap: null,
    builtComponents: {},
    componentName: 'TestComponent',
    rootType: 'COMPONENT',
    warnings: [],
    ...overrides,
  };
}

describe('isPositioningWrapper', () => {
  it('returns true for div.relative wrapping [div.absolute, input]', () => {
    const node = {
      tag: 'div',
      type: 'ELEMENT',
      styles: { position: 'relative', display: 'flex' },
      children: [
        {
          tag: 'div',
          type: 'ELEMENT',
          styles: { position: 'absolute', left: '12px' },
          children: [{ tag: 'svg', type: 'ELEMENT', styles: {}, children: [] }],
        },
        {
          tag: 'input',
          type: 'ELEMENT',
          styles: { position: 'static' },
          children: [],
        },
      ],
    };
    assert.equal(isPositioningWrapper(node), true);
  });

  it('returns true for div wrapping [div.absolute, div.absolute, textarea]', () => {
    const node = {
      tag: 'div',
      type: 'ELEMENT',
      styles: { position: 'relative', display: 'flex' },
      children: [
        { tag: 'div', type: 'ELEMENT', styles: { position: 'absolute' }, children: [] },
        { tag: 'div', type: 'ELEMENT', styles: { position: 'absolute' }, children: [] },
        { tag: 'textarea', type: 'ELEMENT', styles: { position: 'static' }, children: [] },
      ],
    };
    assert.equal(isPositioningWrapper(node), true);
  });

  it('returns false when wrapper has background-color (visual container)', () => {
    const node = {
      tag: 'div',
      type: 'ELEMENT',
      styles: { position: 'relative', backgroundColor: 'rgb(255, 255, 255)' },
      children: [
        { tag: 'div', type: 'ELEMENT', styles: { position: 'absolute' }, children: [] },
        { tag: 'input', type: 'ELEMENT', styles: {}, children: [] },
      ],
    };
    assert.equal(isPositioningWrapper(node), false);
  });

  it('returns false when wrapper has padding (visual container)', () => {
    const node = {
      tag: 'div',
      type: 'ELEMENT',
      styles: { position: 'relative', paddingTop: '8px' },
      children: [
        { tag: 'div', type: 'ELEMENT', styles: { position: 'absolute' }, children: [] },
        { tag: 'input', type: 'ELEMENT', styles: {}, children: [] },
      ],
    };
    assert.equal(isPositioningWrapper(node), false);
  });

  it('returns false when wrapper has border (visual container)', () => {
    const node = {
      tag: 'div',
      type: 'ELEMENT',
      styles: { position: 'relative', borderTopWidth: '1px' },
      children: [
        { tag: 'div', type: 'ELEMENT', styles: { position: 'absolute' }, children: [] },
        { tag: 'input', type: 'ELEMENT', styles: {}, children: [] },
      ],
    };
    assert.equal(isPositioningWrapper(node), false);
  });

  it('returns false when multiple non-absolute children', () => {
    const node = {
      tag: 'div',
      type: 'ELEMENT',
      styles: { position: 'relative' },
      children: [
        { tag: 'span', type: 'ELEMENT', styles: {}, children: [] },
        { tag: 'span', type: 'ELEMENT', styles: {}, children: [] },
      ],
    };
    assert.equal(isPositioningWrapper(node), false);
  });

  it('returns false when the non-absolute child is not a void element', () => {
    const node = {
      tag: 'div',
      type: 'ELEMENT',
      styles: { position: 'relative' },
      children: [
        { tag: 'div', type: 'ELEMENT', styles: { position: 'absolute' }, children: [] },
        { tag: 'div', type: 'ELEMENT', styles: {}, children: [{ tag: 'span', type: 'ELEMENT', styles: {}, children: [] }] },
      ],
    };
    assert.equal(isPositioningWrapper(node), false);
  });

  it('returns true when wrapping a lone void element (no absolute children needed)', () => {
    const node = {
      tag: 'div',
      type: 'ELEMENT',
      styles: { position: 'relative' },
      children: [
        { tag: 'input', type: 'ELEMENT', styles: {}, children: [] },
      ],
    };
    assert.equal(isPositioningWrapper(node), true);
  });

  it('returns false for non-div/span tags', () => {
    const node = {
      tag: 'section',
      type: 'ELEMENT',
      styles: { position: 'relative' },
      children: [
        { tag: 'div', type: 'ELEMENT', styles: { position: 'absolute' }, children: [] },
        { tag: 'input', type: 'ELEMENT', styles: {}, children: [] },
      ],
    };
    assert.equal(isPositioningWrapper(node), false);
  });

  it('returns true for select element (void)', () => {
    const node = {
      tag: 'div',
      type: 'ELEMENT',
      styles: { position: 'relative' },
      children: [
        { tag: 'div', type: 'ELEMENT', styles: { position: 'absolute' }, children: [] },
        { tag: 'select', type: 'ELEMENT', styles: {}, children: [] },
      ],
    };
    assert.equal(isPositioningWrapper(node), true);
  });

  it('returns true for img element (void)', () => {
    const node = {
      tag: 'div',
      type: 'ELEMENT',
      styles: { position: 'relative' },
      children: [
        { tag: 'div', type: 'ELEMENT', styles: { position: 'absolute' }, children: [] },
        { tag: 'img', type: 'ELEMENT', styles: {}, children: [] },
      ],
    };
    assert.equal(isPositioningWrapper(node), true);
  });
});

describe('getPositioningWrapperChild', () => {
  it('returns the non-absolute child', () => {
    const node = {
      tag: 'div',
      type: 'ELEMENT',
      styles: { position: 'relative' },
      children: [
        { tag: 'div', type: 'ELEMENT', styles: { position: 'absolute' }, children: [] },
        { tag: 'input', type: 'ELEMENT', styles: { position: 'static' }, children: [] },
      ],
    };
    const child = getPositioningWrapperChild(node);
    assert.equal(child.tag, 'input');
  });
});

describe('translateNode flattening', () => {
  it('flattens Input pattern: div.relative > [div.absolute, input] → input at root level', () => {
    const dom = {
      tag: 'div',
      type: 'ELEMENT',
      styles: { display: 'flex', position: 'relative', flexDirection: 'row' },
      bounds: { x: 0, y: 0, width: 200, height: 36 },
      attrs: {},
      children: [
        {
          tag: 'div',
          type: 'ELEMENT',
          styles: { position: 'absolute', left: '12px', display: 'flex' },
          bounds: { x: 12, y: 10, width: 16, height: 16 },
          attrs: {},
          children: [],
        },
        {
          tag: 'input',
          type: 'ELEMENT',
          styles: {
            display: 'flex',
            flexDirection: 'row',
            paddingTop: '8px',
            paddingRight: '16px',
            paddingBottom: '8px',
            paddingLeft: '40px',
            borderTopWidth: '1px',
            borderTopLeftRadius: '8px',
            position: 'static',
          },
          bounds: { x: 0, y: 0, width: 200, height: 36 },
          attrs: {},
          children: [],
        },
      ],
    };

    const context = makeContext();
    const ir = translateNode(dom, context, true, null);

    assert.equal(ir.type, 'COMPONENT');
    assert.equal(ir.name, 'TestComponent');
    assert.ok(ir.paddingTop > 0);
    assert.equal(ir.children.length, 2);
    assert.equal(ir.children[0].type, 'FRAME');
    assert.equal(ir.children[1].type, 'TEXT');
    assert.equal(ir.children[1].characters, 'Enter value');
  });

  it('does NOT flatten Button pattern: button > [span, span] (no absolute, no void wrapper)', () => {
    const dom = {
      tag: 'button',
      type: 'ELEMENT',
      styles: { display: 'flex', flexDirection: 'row', paddingTop: '8px', paddingRight: '16px', paddingBottom: '8px', paddingLeft: '16px', backgroundColor: 'rgb(0, 0, 255)' },
      bounds: { x: 0, y: 0, width: 100, height: 36 },
      attrs: {},
      children: [
        { tag: 'span', type: 'ELEMENT', styles: { display: 'flex' }, bounds: { x: 0, y: 0, width: 16, height: 16 }, attrs: {}, children: [] },
        { tag: 'span', type: 'ELEMENT', styles: { display: 'flex' }, bounds: { x: 20, y: 0, width: 60, height: 16 }, attrs: {}, children: [{ type: 'TEXT_NODE', text: 'Label' }] },
      ],
    };

    const context = makeContext();
    const ir = translateNode(dom, context, true, null);

    assert.equal(ir.type, 'COMPONENT');
    assert.equal(ir.children.length, 2);
  });

  it('does NOT flatten when wrapper has visual styles', () => {
    const dom = {
      tag: 'div',
      type: 'ELEMENT',
      styles: { display: 'flex', flexDirection: 'row' },
      bounds: { x: 0, y: 0, width: 200, height: 40 },
      attrs: {},
      children: [
        {
          tag: 'div',
          type: 'ELEMENT',
          styles: { position: 'relative', display: 'flex', backgroundColor: 'rgb(255, 255, 255)', borderTopWidth: '1px', borderTopLeftRadius: '8px' },
          bounds: { x: 0, y: 0, width: 200, height: 36 },
          attrs: {},
          children: [
            { tag: 'div', type: 'ELEMENT', styles: { position: 'absolute' }, bounds: { x: 12, y: 10, width: 16, height: 16 }, attrs: {}, children: [] },
            { tag: 'input', type: 'ELEMENT', styles: { display: 'flex' }, bounds: { x: 0, y: 0, width: 200, height: 36 }, attrs: {}, children: [] },
          ],
        },
      ],
    };

    const context = makeContext();
    const ir = translateNode(dom, context, true, null);

    assert.equal(ir.children.length, 1);
    const wrapperFrame = ir.children[0];
    assert.equal(wrapperFrame.type, 'FRAME');
    assert.equal(wrapperFrame.children.length, 2);
  });

  it('flattens correctly at non-root level too', () => {
    const dom = {
      tag: 'div',
      type: 'ELEMENT',
      styles: { display: 'flex', flexDirection: 'column' },
      bounds: { x: 0, y: 0, width: 400, height: 100 },
      attrs: {},
      children: [
        { tag: 'label', type: 'ELEMENT', styles: { display: 'block' }, bounds: { x: 0, y: 0, width: 100, height: 20 }, attrs: {}, children: [{ type: 'TEXT_NODE', text: 'Name' }] },
        {
          tag: 'div',
          type: 'ELEMENT',
          styles: { position: 'relative', display: 'flex' },
          bounds: { x: 0, y: 24, width: 400, height: 36 },
          attrs: {},
          children: [
            { tag: 'div', type: 'ELEMENT', styles: { position: 'absolute' }, bounds: { x: 12, y: 10, width: 16, height: 16 }, attrs: {}, children: [] },
            { tag: 'input', type: 'ELEMENT', styles: { display: 'flex', flexDirection: 'row', paddingTop: '8px', paddingLeft: '40px', borderTopWidth: '1px' }, bounds: { x: 0, y: 0, width: 400, height: 36 }, attrs: {}, children: [] },
          ],
        },
      ],
    };

    const context = makeContext();
    const ir = translateNode(dom, context, true, null);

    assert.equal(ir.children.length, 2);
    assert.equal(ir.children[1].name, 'input');
    assert.equal(ir.children[1].type, 'FRAME');
  });
});
