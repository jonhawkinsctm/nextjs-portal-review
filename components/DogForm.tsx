import { FormEvent, ReactNode } from "react";
import { Dog, ValidationReport } from "../lib/dogs-api";

interface FormProps {
    preContent?: ReactNode;
    action?: string;
    method?: string;
    dog?: Dog;
    breeds: string[];
    onSubmit?: (e: FormEvent<HTMLFormElement>) => any;
    submitting?: boolean;
    loading?: boolean;
    validationErrors?: {
        [key: string]: ValidationReport[];
    };
}

export function DogForm(props: FormProps) {
    const { dog } = props;

    return (
        <form
            className="dog-form"
            action={props.action}
            method={props.method}
            onSubmit={props.onSubmit}
        >
            {props.preContent}
            {dog?.id && <input type="hidden" name="id" value={dog.id} />}
            <label className="field" htmlFor="name">
                <ErrorMessages errors={props.validationErrors?.name} />
                <span className="label">Name:</span>
                <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={dog?.name}
                />
            </label>
            <label className="field" htmlFor="owner">
                <ErrorMessages errors={props.validationErrors?.owner} />
                <span className="label">Owner:</span>
                <input
                    type="text"
                    id="owner"
                    name="owner"
                    defaultValue={dog?.owner}
                />
            </label>
            <label className="field" htmlFor="breed">
                <ErrorMessages errors={props.validationErrors?.breed} />
                <span className="label">Breed:</span>
                <select id="breed" name="breed" defaultValue={dog?.breed}>
                    {props.breeds.map((b) => (
                        <option key={b} value={b}>
                            {b}
                        </option>
                    ))}
                </select>
            </label>
            <button disabled={props.submitting || props.loading} type="submit">
                Submit
            </button>
        </form>
    );
}

export function ErrorMessages(props: { errors?: ValidationReport[] }) {
    if (!props.errors || !props.errors.length) {
        return null;
    }

    return (
        <div className="field-error">
            {props.errors.map((e) => (
                <span key={e.constraint}>{e.message}</span>
            ))}
        </div>
    );
}
