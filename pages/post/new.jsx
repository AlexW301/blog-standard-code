import {withPageAuthRequired} from "@auth0/nextjs-auth0";
import AppLayout from "../../components/AppLayout/AppLayout";
import {useState} from "react";
import {useRouter} from "next/router";
import {getAppProps} from "../../utils/getAppProps";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBrain} from "@fortawesome/free-solid-svg-icons";

export default function NewPost(props) {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
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
    } catch (e) {
      setGenerating(false);
    }
  };

  return (
    <div className="h-full overflow-hidden">
      {!!generating && (
        <div className="flex flex-col items-center justify-center w-full h-full text-green-500 animate-pulse">
          <FontAwesomeIcon className="text-8xl" icon={faBrain} />
          <h6>Generating...</h6>
        </div>
      )}
      {!generating && (
        <div className="flex flex-col w-full h-full overflow-auto">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-screen-sm p-4 m-auto border rounded-md shadow-xl bg-slate-100 border-slate-200 shadow-slate-200"
          >
            <div>
              <label>
                <strong>Generate a blog post on the topic of:</strong>
              </label>
              <textarea
                className="block w-full px-4 py-2 my-2 rounded-sm resize-none border-slate-500"
                value={topic}
                maxLength={80}
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
                maxLength={80}
                onChange={(e) => setKeywords(e.target.value)}
              ></textarea>
              <small className="block mb-2">Seperate keywords with a comma</small>
            </div>
            <button type="submit" className={`btn`} disabled={!topic.trim() || !keywords.trim()}>
              Generate
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);

    if(!props.availableTokens) {
      return {
        redirect: {
          destination: "/token-topup",
          permanent: false
        }
      }
    }
    return {
      props,
    };
  },
});
