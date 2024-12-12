import { AuthController } from '../controllers/AuthController.js';
import Express from 'express';
import { verifyTokenMiddleware } from '../middlewares/authMiddleware.js';

const auth = new AuthController();
const router = Express.Router();

// ========================================================

router.post('/login',auth.login.bind(auth));
router.post('/register',auth.register.bind(auth));
router.post('/logout',auth.logout.bind(auth));
router.get('/google-signin',auth.googleSignIn.bind(auth));
router.get('/check-auth',verifyTokenMiddleware,auth.checkAuthStatus.bind(auth));


export default router;
