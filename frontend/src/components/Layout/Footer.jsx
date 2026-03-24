import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 bg-white py-4 px-6 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
      <p>&copy; {new Date().getFullYear()} ActiveGym Management System. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
