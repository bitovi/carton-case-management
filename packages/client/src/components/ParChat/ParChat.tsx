export default function ParChat() {
  return (
    <>
      <nuclia-search-bar
        audit_metadata='{"config":"nuclia-standard","widget":"docs-chat"}'
        knowledgebox="4b191d7e-eee8-4d08-98af-aeab91a5924e"
        zone="aws-us-east-2-1"
        state="PRIVATE"
        account="8343ca47-b7fc-46f8-8d51-c2dcd540aaed"
        kbslug="eggberts-internal-docs"
        apikey={import.meta.env.VITE_PAR_API_KEY}
        features="answers,rephrase,suggestions,autocompleteFromNERs,llmCitations,hideResults"
        rag_strategies="neighbouring_paragraphs|2|2"
        feedback="answer"
      />
      <nuclia-search-results />
    </>
  );
}
