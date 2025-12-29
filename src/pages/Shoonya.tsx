import { Button, Flex } from "antd";
import { Link } from "react-router-dom";

export function Shoonya() {
//   const navigate = useNavigate();
  return (
    <div>
      <Flex vertical gap={12} align="center" justify="center" style={{ marginTop: 50 }}>
        <Button>
          <Link to="/news">Websocket start</Link>
        </Button>
        <Button>
          <Link to="/news">Websocket restart</Link>
        </Button>
        <Button>
          <Link to="/news">Websocket stop</Link>
        </Button>
      </Flex>
    </div>
  );
}
