import express from 'express';

const router = express.Router();

router.get('/', (req, res) => res.redirect('/signin'));
router.get('/signin', (req, res) => res.render('signin'));
router.get('/signup', (req, res) => res.render('signup'));
router.get('/profile', (req, res) => res.render('profile'));
router.get('/dashboard/user', (req, res) => res.render('dashboard-user'));
router.get('/dashboard/admin', (req, res) => res.render('dashboard-admin'));
router.get('/403', (req, res) => res.status(403).render('forbidden'));

export default router;
