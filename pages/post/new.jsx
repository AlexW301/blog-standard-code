import {withPageAuthRequired} from "@auth0/nextjs-auth0";
import AppLayout from "../../components/AppLayout/AppLayout";
import {useState} from "react";
import {useRouter} from "next/router";
import { getAppProps } from "../../utils/getAppProps";

export default function NewPost(props) {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/generatePost`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({topic, keywords}),
    });

    const json = await response.json();

    console.log(json);
    if (json?.postId) {
      router.push(`/post/${json.postId}`);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <strong>Generate a blog post on the topic of:</strong>
          </label>
          <textarea
            className="block w-full px-4 py-2 my-2 rounded-sm resize-none border-slate-500"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label>
            <strong>Targeting the following keywords:</strong>
          </label>
          <textarea
            className="block w-full px-4 py-2 my-2 rounded-sm resize-none border-slate-500"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className={`btn`}>
          Generate
        </button>
      </form>
    </div>
  );
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    return {
      props,
    };
  },
});

