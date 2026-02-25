import React from 'react';

interface NucliaSearchBarProps extends React.HTMLAttributes<HTMLElement> {
  audit_metadata?: string;
  knowledgebox?: string;
  zone?: string;
  state?: string;
  account?: string;
  kbslug?: string;
  apikey?: string;
  features?: string;
  rag_strategies?: string;
  feedback?: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'nuclia-search-bar': React.DetailedHTMLProps<
        NucliaSearchBarProps,
        HTMLElement
      >;
      'nuclia-search-results': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}
