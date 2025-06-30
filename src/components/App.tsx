import { useState, useEffect } from 'react';

import BackgroundEffects from './BackgroundEffects';
import Nav from './Nav';
import ContentArea from './ContentArea';
import NavButton from './NavButton';
import ThumbnailScroll from './ThumbnailScroll';
import type {GlobalInitData,ChapterInitData , MenuItem } from './Types';


function App() {
const [globalData, setGlobalData] = useState<GlobalInitData | null>(null);
const [chapterData, setChapterData] = useState<ChapterInitData | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [currentChapter, setCurrentChapter] = useState('about');
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка глобального конфига
  useEffect(() => {
    fetch('/global_init.json')
      .then((res) => res.json())
      .then((data) => {
        setGlobalData(data);
        loadChapter(currentChapter);
      })
      .catch(() => {
        alert('Ошибка загрузки global_init.json');
        setIsLoading(false);
      });
  }, []);

  // Загрузка данных раздела
  const loadChapter = (chapterKey:string) => {
    setIsLoading(true);
    fetch(`/chapters/${chapterKey}/chapter_init.json`)
      .then((res) => res.json())
      .then((data) => {
        setChapterData(data);
        setCurrentPageIndex(0);
        setCurrentChapter(chapterKey);
        setIsLoading(false);
      })
      .catch(() => {
        alert(`Ошибка загрузки chapter_init.json для ${chapterKey}`);
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Загрузка...</div>
      </div>
    );
  }

  const currentChapterName =
    globalData?.menu.find((item: MenuItem) => item.key === currentChapter)?.name || '';
  const currentPage = chapterData?.pages[currentPageIndex];
  const maniPage = chapterData?.pages.length !== 1;

  const goToPage = (direction: number) => {
    setCurrentPageIndex((prev) => {
      if (!chapterData) return prev;
      const newIndex = prev + direction;
      if (newIndex < 0 || newIndex >= chapterData.pages.length) return prev;
      return newIndex;
    });
  };
if(globalData === null || chapterData === null) return null;

  return (
    <div className="app-container">
      <BackgroundEffects />
      <Nav menu={globalData.menu} currentChapter={currentChapter} onSelect={loadChapter} />

      <main className="main-content">
        <div className="section-title">
          <h1>{currentChapterName}: <span className="page-title">{currentPage?.title}</span></h1>
        </div>

        <div key={currentPageIndex} className="content-wrapper">
          <ContentArea page={currentPage} />
        </div>
      </main>

      {maniPage && <ThumbnailScroll
        pages={chapterData?.pages}
        currentPageIndex={currentPageIndex}
        selectThumbnail={setCurrentPageIndex}
      />}

      {maniPage && <NavButton direction="left" onClick={() => goToPage(-1)} />}
      {maniPage && <NavButton direction="right" onClick={() => goToPage(1)} />}
    </div>
  );
}

export default App;