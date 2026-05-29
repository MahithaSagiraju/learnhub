const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-dark-card border-t border-gray-200 dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} LearnHub. All rights reserved.</p>
          <p className="mt-1">Empowering learning through AI-powered education.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
