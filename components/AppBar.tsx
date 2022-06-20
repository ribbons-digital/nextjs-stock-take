import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Icon,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useAuth } from "lib/Auth";
import { useRouter } from "next/router";
import { BiBarcode } from "react-icons/bi";
import { BsBox } from "react-icons/bs";
import { ImExit } from "react-icons/im";
import { TbReportMoney } from "react-icons/tb";

export default function AppBar() {
  const { user, signout } = useAuth();
  const router = useRouter();

  return (
    <div className="w-full flex items-center justify-between p-2 pl-4 bg-blue-500">
      <Image width="80px" src="/nm_logo.png" alt="nomad nature logo" />
      {user && (
        <Box pr="4">
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon />}
              variant="ghost"
              color="gray.800"
              fontSize="lg"
            />
            <MenuList>
              <MenuItem
                onClick={() => router.push("/products")}
                icon={<Icon as={BiBarcode} className="text-xl" />}
              >
                Products
              </MenuItem>
              <MenuItem
                onClick={() => router.push("/orders")}
                icon={<Icon as={TbReportMoney} className="text-xl" />}
              >
                Orders
              </MenuItem>
              <MenuItem
                onClick={() => router.push("/items")}
                icon={<Icon as={BsBox} className="text-xl" />}
              >
                Items
              </MenuItem>
              <MenuItem
                onClick={() => {
                  signout();
                  router.push("/login");
                }}
                icon={<Icon as={ImExit} className="text-xl" />}
              >
                Sign out
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      )}
    </div>
  );
}
