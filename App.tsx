import React, { useState } from 'react';
import Layout from './components/Layout';
import MinutesGenerator from './components/MinutesGenerator';
import SeoArticle from './components/SeoArticle';

const App: React.FC = () => {
  const [modalContent, setModalContent] = useState<{ title: string; content: React.ReactNode } | null>(null);

  const openModal = (type: string) => {
    const contentMap: { [key: string]: { title: string, content: React.ReactNode } } = {
        'About': { title: 'About Us', content: <p>This tool was created to streamline the process of documenting meeting outcomes, powered by modern web technologies and a passion for productivity.</p> },
        'Contact': { title: 'Contact Information', content: <p>For inquiries, please reach out to <a href="mailto:hsini.web@gmail.com" className="text-yellow-400 hover:underline">hsini.web@gmail.com</a> or visit <a href="https://doodax.com" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">doodax.com</a>.</p> },
        'Guide': { title: 'How to Use', content: <p>Simply fill out the fields in the form. As you type, the Markdown output on the right will update in real-time. Use the 'Add Action Item' button for multiple tasks. Once you're done, copy the markdown or simulate a DOCX download.</p> },
        'Privacy': { title: 'Privacy Policy', content: <p>We respect your privacy. All data entered into this tool remains on your local device and is not sent to any server. We do not store or track your meeting minutes.</p> },
        'TOS': { title: 'Terms of Service', content: <p>This tool is provided "as is" without any warranties. By using this service, you agree not to hold the creators liable for any issues that may arise.</p> },
        'DMCA': { title: 'DMCA Policy', content: <p>If you believe any content infringes upon your copyright, please contact us at <a href="mailto:hsini.web@gmail.com" className="text-yellow-400 hover:underline">hsini.web@gmail.com</a> with the necessary details.</p> },
    };
    setModalContent(contentMap[type]);
  };

  const closeModal = () => setModalContent(null);

  return (
    <Layout openModal={openModal} modalContent={modalContent} closeModal={closeModal}>
      <div className="container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-10 md:mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg">
            Effortless Meeting Minutes
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-300 max-w-3xl mx-auto">
            Instantly create professional, well-formatted meeting minutes. Fill in the details below and get your Markdown-ready template in seconds.
          </p>
        </header>

        <main className="max-w-7xl mx-auto">
          <MinutesGenerator openGuide={openModal} />
          <SeoArticle />
        </main>
      </div>
    </Layout>
  );
};

export default App;