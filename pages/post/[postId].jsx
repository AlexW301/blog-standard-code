import {getSession, withPageAuthRequired} from "@auth0/nextjs-auth0";
import AppLayout from "../../components/AppLayout/AppLayout";
import clientPromise from "../../lib/mongodb";
import {ObjectId} from "mongodb";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHashtag} from "@fortawesome/free-solid-svg-icons";
import {getAppProps} from "../../utils/getAppProps";
import {useContext, useState} from "react";
import { useRouter } from "next/router";
import PostsContext from "../../context/postsContext";

export default function Post(props) {
  console.log(props);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { deletePost } = useContext(PostsContext)
  const router = useRouter()

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/deletePost`, {
        method: "POST",
        headers: {
          'content-type': "application/json"
        },
        body: JSON.stringify({postId: props.id})
      })
      const json = await response.json();
      if(json.success) {
        deletePost(props.id)
        router.replace(`/post/new`)
      }
    } catch (error) {
      
    }
  }
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
        <div className="my-4">
          {!showDeleteConfirm && (
            <button onClick={() => setShowDeleteConfirm(true)} className="bg-red-600 btn hover:bg-red-700">
              Delete POST
            </button>
          )}
          {!!showDeleteConfirm && (
            <div>
              <p className="p-2 text-center bg-red-300">Are you sure you want to delete this post? This action is irreversible</p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setShowDeleteConfirm(false)} className="btn bg-stone-600 hover:bg-stone-700">cancel</button>
                <button onClick={handleDeleteConfirm} className="bg-red-600 btn hover:bg-red-700">confirm delete</button>
              </div>
            </div>
            )}
        </div>
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
        id: ctx.params.postId,
        postContent: post.postContent,
        title: post.title,
        metaDescription: post.metaDescription,
        keywords: post.keywords,
        postCreated: post.created.toString(),
        ...props,
      },
    };
  },
});
