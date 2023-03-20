import {getSession, withPageAuthRequired} from "@auth0/nextjs-auth0";
import AppLayout from "../../components/AppLayout/AppLayout";
import clientPromise from "../../lib/mongodb";
import {ObjectId} from "mongodb";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHashtag} from "@fortawesome/free-solid-svg-icons";
import { getAppProps } from "../../utils/getAppProps";

export default function Post(props) {
  console.log(props);
  return (
    <div className="h-full overflow-auto">
      <div className="max-w-screen-sm mx-auto">
        <div className="p-2 mt-6 text-sm font-bold rounded-sm bg-stone-200">SEO Title and Meta Description</div>
        <div className="p-4 my-2 border rounded-md border-stone-200">
          <div className="text-2xl font-bold text-blue-600">{props.title}</div>
          <div className="mt-2">{props.metaDescription}</div>
        </div>
        <div className="p-2 mt-6 text-sm font-bold rounded-sm bg-stone-200">Keywords</div>
        <div className="flex flex-wrap gap-1 pt-2">
          {props.keywords.split(",").map((keyword, i) => (
            <div key={i} className="p-2 text-white rounded-full bg-slate-800">
              <FontAwesomeIcon icon={faHashtag} />
              {keyword}
            </div>
          ))}
        </div>
        <div className="p-2 mt-6 text-sm font-bold rounded-sm bg-stone-200">Blog Post</div>
        <div dangerouslySetInnerHTML={{__html: props.postContent || ""}}></div>
      </div>
    </div>
  );
}

Post.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    const userSession = await getSession(ctx.req, ctx.res);
    const client = await clientPromise;
    const db = client.db("BlogStandard");
    const user = await db.collection("users").findOne({
      auth0Id: userSession.user.sub,
    });
    const post = await db.collection("posts").findOne({
      _id: new ObjectId(ctx.params.postId),
      userId: user._id,
    });

    if (!post) {
      return {
        redirect: {
          destination: "/post/new",
          permanent: false,
        },
      };
    }

    return {
      props: {
        postContent: post.postContent,
        title: post.title,
        metaDescription: post.metaDescription,
        keywords: post.keywords,
        ...props
      },
    };
  },
});
