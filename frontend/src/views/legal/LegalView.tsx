import legalTexts from "./texts.json";

type Props = {
    type: "impressum" | "privacy"
}

export default function LegalView({type}: Props) {

    const activeText = legalTexts[type];

    return (
        <>
        <h1>{activeText.title}</h1>
        <p>{activeText.description}</p>
        </>
    )
}