import { useNavigate } from "react-router-dom";
const Navigate = ({to}: any) => {
    const navigate = useNavigate();
    navigate(to);
}
export default Navigate