URL API : https://apigabg.onrender.com
DOC Postman : https://documenter.getpostman.com/view/27304910/2s93sgXqxa

1: J'ai traduit les messages d'erreurs en anglais pour un code de meilleur qualité.
2: Sur Postman, j'ai essayé d'automatiser tout les tests en utilisant des variables, mais j'ai rencontré quelques problèmes sur certaines requêtes.
Il y a donc des requêtes ou l'id passé dois être changé à la main, surtout dans le folder "categories". Sinon les folders users/products/cart/search/Authentification marche
les uns après les autres lorsqu'un "run" seulement le folder. J'ai essayé de mettre en ordre les requêtes pour que les tests fonctionnent en ajoutant des requêtes qui échouent pour "tester".
3: J'ai inclus des réponses JSON dans mes tests HTTP. Les tests fonctionnaient bien jusqu'à ce que les messages attendu soient différents des messages recu. J'ai tenté de les corriger
mais ils semblaient changer de temps à autres sans que je sache pourquoi.
4.J'avais implanté un middleware is-admin au départ avec une fonction que j'avais ajouté un route put/post/delete de categorie. Elle fonctionnait bien lorsque j'étais en "local" mais lorsque j'ai essayé d'héberger mon app sur render.com , l'application "crashais" et je n'ai pas réussi à résoudre mon problème. J'ai donc passé une vérification directement dans les 3 controlleurs concernés.