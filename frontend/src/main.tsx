import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import App from './App.tsx';
import "./styles/main.scss";
import translationEn from '../locales/en/translation.json';
import translationDe from '../locales/de/translation.json';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
.use(LanguageDetector)
.use(initReactI18next)
.init({
    supportedLngs: ['de', 'en'],
    resources: {
        en: {
            translation: translationEn
        },
        de: {
            translation: translationDe
        }
    },
    fallbackLng: 'en'
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);