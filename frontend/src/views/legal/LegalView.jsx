import legalTexts from "./texts.json";

export default function LegalView({type}) {

    const activeText = legalTexts[type];

    return (
        <>
        <h1>{activeText.title}</h1>
        <p>{activeText.description}</p>
        </>
    )
}