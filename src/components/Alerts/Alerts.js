import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const errAlert = (text) => toast.error(text);