const translations = {
    en: {
        'page-title': 'Course Management Platform - My Reflection',
        'welcome-title': 'Welcome to My Learning Journey',
        'welcome-message': 'This reflection page showcases my experience building a comprehensive Course Management Platform backend system. Through this project, I\'ve demonstrated proficiency in Node.js, Express, MySQL, Redis, and modern web development practices.',
        'question-1': 'What did you enjoy most about building this Course Management Platform?',
        'answer-1': 'I thoroughly enjoyed implementing the comprehensive authentication system and role-based access control. Creating a secure, scalable backend with JWT authentication, bcrypt password hashing, and proper middleware for authorization was both challenging and rewarding. The integration of Redis for notification queuing and the implementation of background workers for automated reminders showcased real-world application development skills.',
        'question-2': 'What was the most challenging aspect of the project?',
        'answer-2': 'The most challenging aspect was designing and implementing the complex database relationships using Sequelize ORM. Managing the intricate connections between Users, Facilitators, Course Offerings, and Activity Trackers while maintaining data integrity and implementing proper foreign key constraints required careful planning. Additionally, setting up the Redis-backed notification system with Bull queues for background job processing pushed me to understand asynchronous operations and message queuing systems deeply.',
        'question-3': 'What improvements would you suggest for future development?',
        'answer-3': 'For future improvements, I would implement real-time notifications using WebSocket connections to provide instant updates to managers and facilitators. Adding comprehensive audit logging would enhance security and traceability. I\'d also suggest implementing file upload capabilities for course materials, creating a dashboard with analytics and reporting features, and adding email notification integration. Performance optimization through database indexing and caching strategies would further enhance the system\'s scalability.',
        'tech-title': 'Technical Implementation Highlights',
        'tech-1-title': 'RESTful API Design',
        'tech-1-desc': 'Comprehensive API with proper HTTP methods, status codes, and Swagger documentation',
        'tech-2-title': 'Database Architecture',
        'tech-2-desc': 'Normalized MySQL schema with Sequelize ORM and proper relationship management',
        'tech-3-title': 'Security Implementation',
        'tech-3-desc': 'JWT authentication, bcrypt hashing, input validation, and role-based access control',
        'tech-4-title': 'Background Processing',
        'tech-4-desc': 'Redis queues with Bull for automated notifications and deadline reminders',
        'footer-text': 'Built with passion for learning and excellence in software development'
    },
    fr: {
        'page-title': 'Plateforme de Gestion de Cours - Ma Réflexion',
        'welcome-title': 'Bienvenue dans Mon Parcours d\'Apprentissage',
        'welcome-message': 'Cette page de réflexion présente mon expérience dans la construction d\'un système backend complet de gestion de cours. À travers ce projet, j\'ai démontré ma maîtrise de Node.js, Express, MySQL, Redis et des pratiques modernes de développement web.',
        'question-1': 'Qu\'avez-vous le plus apprécié dans la construction de cette Plateforme de Gestion de Cours ?',
        'answer-1': 'J\'ai particulièrement apprécié l\'implémentation du système d\'authentification complet et du contrôle d\'accès basé sur les rôles. Créer un backend sécurisé et évolutif avec l\'authentification JWT, le hachage de mots de passe bcrypt et les middleware appropriés pour l\'autorisation était à la fois stimulant et gratifiant. L\'intégration de Redis pour la mise en file d\'attente des notifications et l\'implémentation de workers en arrière-plan pour les rappels automatisés ont démontré des compétences de développement d\'applications du monde réel.',
        'question-2': 'Quel était l\'aspect le plus difficile du projet ?',
        'answer-2': 'L\'aspect le plus difficile était de concevoir et d\'implémenter les relations complexes de base de données en utilisant Sequelize ORM. Gérer les connexions complexes entre les Utilisateurs, les Facilitateurs, les Offres de Cours et les Suiveurs d\'Activité tout en maintenant l\'intégrité des données et en implémentant des contraintes de clés étrangères appropriées nécessitait une planification minutieuse. De plus, la mise en place du système de notification basé sur Redis avec les files d\'attente Bull pour le traitement des tâches en arrière-plan m\'a poussé à comprendre profondément les opérations asynchrones et les systèmes de mise en file d\'attente des messages.',
        'question-3': 'Quelles améliorations suggéreriez-vous pour le développement futur ?',
        'answer-3': 'Pour les améliorations futures, j\'implémenterais des notifications en temps réel utilisant des connexions WebSocket pour fournir des mises à jour instantanées aux gestionnaires et facilitateurs. L\'ajout d\'un journal d\'audit complet améliorerait la sécurité et la traçabilité. Je suggérerais également d\'implémenter des capacités de téléchargement de fichiers pour les matériaux de cours, de créer un tableau de bord avec des fonctionnalités d\'analyse et de rapport, et d\'ajouter l\'intégration de notifications par email. L\'optimisation des performances grâce à l\'indexation de base de données et aux stratégies de mise en cache améliorerait davantage l\'évolutivité du système.',
        'tech-title': 'Points Forts de l\'Implémentation Technique',
        'tech-1-title': 'Conception API RESTful',
        'tech-1-desc': 'API complète avec méthodes HTTP appropriées, codes de statut et documentation Swagger',
        'tech-2-title': 'Architecture de Base de Données',
        'tech-2-desc': 'Schéma MySQL normalisé avec Sequelize ORM et gestion appropriée des relations',
        'tech-3-title': 'Implémentation de Sécurité',
        'tech-3-desc': 'Authentification JWT, hachage bcrypt, validation d\'entrée et contrôle d\'accès basé sur les rôles',
        'tech-4-title': 'Traitement en Arrière-plan',
        'tech-4-desc': 'Files d\'attente Redis avec Bull pour les notifications automatisées et les rappels d\'échéance',
        'footer-text': 'Construit avec passion pour l\'apprentissage et l\'excellence dans le développement logiciel'
    }
};

// Make translations available globally
window.translations = translations;
console.log('Translations loaded:', window.translations);