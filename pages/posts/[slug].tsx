import fs from "fs";
import matter from "gray-matter";
import path from "path";

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
}

export default function Post({ postData }: Props) {
  return (
    <div>
      <h1 className="text-5xl text-gray-900">{postData.data.title}</h1>
      <p>{postData.content}</p>
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

  return {
    props: {
      slug,
      postData,
    },
  };
}
