import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkHtml from "remark-html";
import Head from "next/head";

interface Props {
  postData: {
    content: string;
    data: {
      title: string;
      slug: string;
    };
    isEmpty: boolean;
    excerpt: string;
  };
  innerContent: string;
}

export default function Post({ postData, innerContent }: Props) {
  return (
    <div className="prose">
      <Head>
        <title>{postData.data.title}</title>
      </Head>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: innerContent }}
      ></div>
    </div>
  );
}

export async function getStaticPaths() {
  const files = fs.readdirSync(path.join("posts"));

  const paths = files.map((file) => {
    const str = fs.readFileSync(path.join("posts", file), "utf8");

    const postData = matter(str);

    return {
      params: {
        slug: postData.data.slug,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }: any) {
  const str = fs.readFileSync(path.join("posts", `${slug}.md`), "utf8");

  const postData = matter(str, { excerpt: true });

  const file = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(postData.content);

  return {
    props: {
      slug,
      postData,
      innerContent: String(file),
    },
  };
}
