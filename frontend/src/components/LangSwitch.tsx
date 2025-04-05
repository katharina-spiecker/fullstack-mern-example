import i18n from "i18next";

export default function LangSwitch() {

    function handleLangSwitch(e: React.ChangeEvent<HTMLSelectElement>) {
        i18n.changeLanguage(e.target.value);
    }

    return (
        <select className="bg-transparent lg:me-2" onChange={handleLangSwitch} defaultValue={i18n.language}>
            <option value="de">DE</option>
            <option value="en">EN</option>
        </select>
    )
}