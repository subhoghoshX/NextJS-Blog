import Head from "next/head";
import fs from "fs";
import matter from "gray-matter";
import path from "path";
import Link from "next/link";

interface PostsData {
  title: string;
  slug: string;
}

interface Props {
  postsData: PostsData[];
}

export default function Home({ postsData }: Props) {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="font-bold text-3xl">Blog home Page</h1>

        <section className="flex gap-x-8 mt-10">
          {postsData.map((post, index) => {
            return (
              <article key={index} className="border p-10">
                <h2 className="font-bold text-xl">{post.title}</h2>
                <Link href={`/posts/${post.slug}`}>
                  <a className="text-blue-500">{post.slug}</a>
                </Link>
              </article>
            );
          })}
        </section>

        <Link href="/posts">
          <a className="text-white px-4 py-2 bg-blue-500 font-bold mt-8 inline-block">
            Browse All Posts
          </a>
        </Link>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const files = fs.readdirSync(path.join("posts"));

  const postsData = files.slice(0, 4).map((file) => {
    const str = fs.readFileSync(path.join("posts", file), "utf8");

    const postData = matter(str);

    return postData.data;
  });

  return {
    props: {
      postsData,
    },
  };
}
