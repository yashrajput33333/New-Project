import React from "react";
import { Container, Logo, LogoutBtn } from "../index";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "All Posts", slug: "/all-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
  ];

  return (
    <header className="py-4 shadow-md bg-gray-900 text-white">
      <Container>
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div>
            <Link to="/">
              <Logo width="80px" />
            </Link>
          </div>

          {/* Navigation Links */}
          <ul className="flex space-x-6">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      className="px-5 py-2 rounded-lg text-sm font-medium transition duration-300 hover:bg-gray-700 hover:text-gray-200"
                    >
                      {item.name}
                    </button>
                  </li>
                )
            )}

            {/* Logout Button (only if logged in) */}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
