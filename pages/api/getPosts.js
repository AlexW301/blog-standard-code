import {getSession, withApiAuthRequired} from "@auth0/nextjs-auth0";

export default withApiAuthRequired(async function handler(req, res) {
  try {
    const {
      user: {sub},
    } = await getSession(req, res);
    
  } catch (error) {}
});
