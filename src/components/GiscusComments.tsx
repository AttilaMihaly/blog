import Giscus from '@giscus/react';

export default function GiscusComments() {
  return (
    <Giscus
      repo="AttilaMihaly/blog"
      repoId="R_kgDOSZSHqQ"
      category="Announcements"
      categoryId="DIC_kwDOSZSHqc4DDFCC"
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
