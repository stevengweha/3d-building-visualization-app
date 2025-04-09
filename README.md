# React + TypeScript + Vite

Ce modèle fournit une configuration minimale pour faire fonctionner React avec Vite, HMR et quelques règles ESLint.

Actuellement, deux plugins officiels sont disponibles :

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) utilise [Babel](https://babeljs.io/) pour le rafraîchissement rapide (Fast Refresh)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) utilise [SWC](https://swc.rs/) pour le rafraîchissement rapide (Fast Refresh)

## Étendre la configuration ESLint

Si vous développez une application de production, nous recommandons de mettre à jour la configuration pour activer les règles de linting sensibles au type :

```js
export default tseslint.config({
  extends: [
    // Remplacez ...tseslint.configs.recommended par ceci
    ...tseslint.configs.recommendedTypeChecked,
    // Alternativement, utilisez ceci pour des règles plus strictes
    ...tseslint.configs.strictTypeChecked,
    // Optionnellement, ajoutez ceci pour des règles stylistiques
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // autres options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

Vous pouvez également installer [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) et [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) pour des règles spécifiques à React :

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Ajoutez les plugins react-x et react-dom
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // autres règles...
    // Activez ses règles recommandées pour TypeScript
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
