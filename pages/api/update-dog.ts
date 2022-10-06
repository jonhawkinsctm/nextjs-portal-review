import { NextApiHandler, NextApiRequest } from "next";
import { callApi } from "../../lib/callApi";
import { createFormResponse } from "../../lib/forms";
import { getSession } from "../../lib/session";

const handler: NextApiHandler = async (req: NextApiRequest, res) => {
    if (req.method?.toUpperCase() === "GET") {
        return res.status(404).json({ data: "page not found" });
    }

    const { id, formId, ...update } = req.body;
    const session = await getSession(req, res);

    delete session.editDogResponse;

    const apiRes = await callApi("dog/" + id, {
        method: "PATCH",
        payload: update,
    });

    if (req.headers.accept !== "application/json") {
        console.log(apiRes);

        // This is super janky... Ideally we'd want a flash bag or something...
        if (apiRes.statusCode) {
            session.editDogResponse = {
                id: formId,
                response: createFormResponse(update, apiRes),
            };
        }

        return res.redirect(`/ssr/dogs/${id}?formId=${formId}`);
    }

    return res.status(apiRes.statusCode || 200).send(apiRes);
};

export default handler;
