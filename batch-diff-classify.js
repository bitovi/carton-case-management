#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PIPELINE_DIR = '.temp/react-to-figma-dom';
const SKILL_DIR = '.claude/skills/react-to-figma-dom';

const components = [
  'AccordionContent','AccordionHeader','AccordionItem','AccordionTrigger','AlertDialog','BaseEditable','Button','CartonLogo','Checkbox','DayPicker','Dialog','DialogDescription','DialogTitle','FiltersTrigger','HoverCard','Input','Label','MenuList','Popover','PopoverContent','PopoverTrigger','Select','SelectContent','SelectGroup','SelectIcon','SelectItem','SelectItemIndicator','SelectItemText','SelectLabel','SelectOverflowIndicator','SelectSeparator','SelectTrigger','SelectValue','SelectViewport','Sheet','Textarea','Tooltip','TooltipContent','TooltipTrigger','Accordion','Calendar','CaseList','CheckboxGroup','Comments','ConfirmationDialog','CreateCasePage','CreateCustomerPage','CreateTaskPage','CreateUserPage','CustomerList','DialogHeader','EditControls','EditableCurrency','EditableDate','EditableNumber','EditablePercent','EditableSelect','EditableText','EditableTextarea','EditableTitle','MenuItem','MoreOptionsMenu','MultiSelect','RelationshipManagerList','RichCheckboxGroup','TaskList','UserList','CaseComments','CaseEssentialDetails','CaseInformation','CustomerInformation','FiltersList','Header','RelationshipManagerAccordion','RelationshipManagerDialog','TaskComments','TaskEssentialDetails','TaskInformation','UserInformation','CaseDetails','FiltersDialog','ReactionStatistics','RelatedCasesAccordion','TaskDetails','CasePage','CustomerDetails','TaskPage','UserDetails','CustomerPage','UserPage','App'
];

let passed = 0, failed = 0, skipped = 0;
const withVariants = [];

// First pass: identify which components have actual variant captures
for (const comp of components) {
  const compDir = path.join(PIPELINE_DIR, 'components', comp);
  const varDir = path.join(compDir, 'variants');
  if (!fs.existsSync(varDir)) continue;
  
  // Check if there are actual variant subdirectories
  const files = fs.readdirSync(varDir);
  const hasVariantDirs = files.some(f => fs.statSync(path.join(varDir, f)).isDirectory() && !f.startsWith('.'));
  if (hasVariantDirs) {
    withVariants.push(comp);
  }
}

console.log(`Found ${withVariants.length} components with variant captures\n`);

for (const comp of withVariants) {
  const compDir = path.join(PIPELINE_DIR, 'components', comp);
  const codeVariantsFile = path.join(compDir, 'code-variants.json');
  const varDir = path.join(compDir, 'variants');
  
  if (!fs.existsSync(codeVariantsFile)) {
    skipped++;
    console.log(`⏭️  ${comp}: no code-variants.json`);
    continue;
  }

  try {
    execSync(`node ${SKILL_DIR}/scripts/diff-variants.js --variants-dir "${varDir}"`, {stdio:'pipe'});
    
    const manifest = path.join(varDir, 'capture-manifest.json');
    if (!fs.existsSync(manifest)) throw new Error('no manifest');
    
    execSync(`node ${SKILL_DIR}/7-generate-build-scripts/scripts/classify-variants.js --code-variants "${codeVariantsFile}" --output "${path.join(compDir, 'figma-variants.json')}"`, {stdio:'pipe'});

    if (fs.existsSync(path.join(compDir, 'figma-variants.json'))) {
      passed++;
      console.log(`✅ ${comp}`);
    } else {
      failed++;
      console.log(`❌ ${comp}: no output`);
    }
  } catch (e) {
    failed++;
    console.log(`❌ ${comp}: error`);
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`SUMMARY: Processed ${withVariants.length} components with variants`);
console.log(`PASS: ${passed}/${withVariants.length}, FAIL: ${failed}, SKIPPED: ${skipped}`);
console.log(`\nTotal ready for Figma build: ${passed}`);
console.log(`Components needing variant captures: ${93 - withVariants.length}`);
