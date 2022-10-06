import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { DogForm } from "../../../components/DogForm";
import { Layout } from "../../../components/Layout";
import { callApi } from "../../../lib/callApi";
import { Dog } from "../../../lib/dogs-api";
import { createFormResponse, FormResponse } from "../../../lib/forms";
import { getSessionFromContext } from "../../../lib/session";
import { NextPageWithLayout } from "../../_app";
import crypto from "crypto";

export interface EditDogPageProps {
    formId: string;
    dog: Dog;
    breeds: string[];
    form: FormResponse | null;
}

const EditDogPage: NextPageWithLayout<EditDogPageProps> = (props) => {
    return (
        <DogForm
            action="/api/update-dog"
            method="post"
            preContent={
                <>
                    <h1>Edit &ldquo;{props.dog.name}&ldquo;</h1>
                    <input type="hidden" name="formId" value={props.formId} />
                </>
            }
            dog={props.dog}
            breeds={props.breeds}
            validationErrors={props.form?.validationErrors}
        />
    );
};

EditDogPage.getLayout = (page) => {
    return <Layout current="ssr">{page}</Layout>;
};

export default EditDogPage;

export async function getServerSideProps(
    context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<EditDogPageProps>> {
    const dogId = context.params?.dogId;

    if (typeof dogId !== "string") {
        return { notFound: true };
    }

    const [dog, breeds, session] = await Promise.all([
        callApi(`dog/${dogId}`),
        callApi(`breeds`),
        getSessionFromContext(context),
    ]);

    // This stuff with the formId is kinda crazy and there must be a better way to do it...
    const formId = getFormId(context);
    const formResponse = session.editDogResponse;
    let form;

    if (formResponse?.id) {
        if (formResponse.id === formId) {
            form = formResponse.response;
        } else {
            delete session.editDogResponse;
        }
    }

    if (!form) {
        form = createFormResponse(dog);
    }

    return {
        props: {
            formId,
            dog,
            breeds,
            form,
        },
    };
}

function getFormId(context: GetServerSidePropsContext) {
    // Check if the API has populated a form response.
    if (context.req.url) {
        const url = new URL(context.req.url, "http://localhost/");
        const formId = url.searchParams.get("formId");

        if (formId) {
            return formId;
        }
    }

    return crypto.randomUUID();
}
