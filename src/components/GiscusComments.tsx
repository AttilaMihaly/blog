import Giscus from '@giscus/react';

// Fill in these values after setting up Giscus at https://giscus.app
// See README.md for instructions.
export default function GiscusComments() {
  return (
    <Giscus
      repo="OWNER/REPO"
      repoId="REPO_ID"
      category="Announcements"
      categoryId="CATEGORY_ID"
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme="light"
      lang="en"
    />
  );
}
