---
title: Vocabulary
---

<script setup>
const speak = (text) => {
  if (typeof window === 'undefined') return;
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = 'en-US';
  const voices = window.speechSynthesis.getVoices();
  msg.voice = voices.find(v => v.lang === 'en-US' && (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Samantha'))) || voices.find(v => v.lang === 'en-US') || null;
  window.speechSynthesis.speak(msg);
};
</script>

# Vocabulary

| 單字 | 中文意思 | 英文例句 | 翻譯說明 |
| --- | --- | --- | --- |
| abbreviated <button @click="speak('abbreviated')" title="發音" class="pronounce-btn">🔊</button> | 縮寫、簡稱 | The word is abbreviated as follows.<br>這個單字縮寫如下。 | 常指將單字或句子簡化，翻譯時可直接譯為「縮寫為...」。 |
| accidentally <button @click="speak('accidentally')" title="發音" class="pronounce-btn">🔊</button> | 偶然，意外 | I accidentally deleted the file.<br>我不小心刪除了檔案。 |  |
| accompanied <button @click="speak('accompanied')" title="發音" class="pronounce-btn">🔊</button> | 伴隨，附帶 | The meal was accompanied by a glass of wine.<br>這餐點附帶一杯葡萄酒。 | 翻譯時可視為主動「伴隨」或被動「附帶」。 |
| accomplished <button @click="speak('accomplished')" title="發音" class="pronounce-btn">🔊</button> | 完成 | She accomplished her goal.<br>她完成了她的目標。 |  |
| accordingly <button @click="speak('accordingly')" title="發音" class="pronounce-btn">🔊</button> | 相應地 / 隨之 | Please adjust your schedule accordingly.<br>請相應地調整你的行程。 | 常放在句尾，表示根據前述狀況採取行動。 |
| aid <button @click="speak('aid')" title="發音" class="pronounce-btn">🔊</button> | 幫助、援助 | The tools aid the development process.<br>這些工具幫助了開發過程。 |  |
| aim <button @click="speak('aim')" title="發音" class="pronounce-btn">🔊</button> | 目的 | Our aim is to provide good service.<br>我們的目的是提供良好的服務。 |  |
| aim to <button @click="speak('aim to')" title="發音" class="pronounce-btn">🔊</button> | 意圖、旨在 | We aim to finish this by tomorrow.<br>我們旨在明天前完成這個。 | 後面常接動詞原形，翻譯為「目的在於...」。 |
| along the way <button @click="speak('along the way')" title="發音" class="pronounce-btn">🔊</button> | 一路走來 / 在這過程中 | We learned a lot along the way.<br>我們在一路走來學到了很多。 |  |
| along with <button @click="speak('along with')" title="發音" class="pronounce-btn">🔊</button> | 以及 / 連同 | He came along with his friends.<br>他跟他的朋友們一起來了。 |  |
| alongside <button @click="speak('alongside')" title="發音" class="pronounce-btn">🔊</button> | 與……並存 / 並肩 | She worked alongside him for years.<br>她與他並肩工作了許多年。 |  |
| alternatively <button @click="speak('alternatively')" title="發音" class="pronounce-btn">🔊</button> | 或者 / 要不然 | Alternatively, you can use the command line.<br>或者，你可以使用命令列。 | 常用在提供第二種解決方案時的句首。 |
| ambitious <button @click="speak('ambitious')" title="發音" class="pronounce-btn">🔊</button> | 抱負不凡的 / 有雄心的 | It is an ambitious project.<br>這是一個雄心勃勃的專案。 |  |
| ambitious goal <button @click="speak('ambitious goal')" title="發音" class="pronounce-btn">🔊</button> | 雄心勃勃的目標 | They set an ambitious goal for the year.<br>他們為今年設定了一個雄心勃勃的目標。 |  |
| and so on <button @click="speak('and so on')" title="發音" class="pronounce-btn">🔊</button> | 依此類推 / 等等 | We sell apples, oranges, and so on.<br>我們販賣蘋果、橘子，依此類推。 |  |
| anticipate <button @click="speak('anticipate')" title="發音" class="pronounce-btn">🔊</button> | 預料 / 預期 | We anticipate a lot of traffic today.<br>我們預料今天會有很多流量。 |  |
| appearance <button @click="speak('appearance')" title="發音" class="pronounce-btn">🔊</button> | 外觀 | You can customize the appearance of the button.<br>你可以自訂按鈕的外觀。 |  |
| applicable <button @click="speak('applicable')" title="發音" class="pronounce-btn">🔊</button> | 適用的 | This rule is applicable to everyone.<br>這項規則適用於所有人。 |  |
| appropriate <button @click="speak('appropriate')" title="發音" class="pronounce-btn">🔊</button> | 合適的 / 適當的 | Please use the appropriate tool.<br>請使用合適的工具。 |  |
| arbitrary <button @click="speak('arbitrary')" title="發音" class="pronounce-btn">🔊</button> | 隨意的 / 任意的 | It was an arbitrary decision.<br>這是一個隨意的決定。 |  |
| are preferred as <button @click="speak('are preferred as')" title="發音" class="pronounce-btn">🔊</button> | 首選為... | These methods are preferred as standard.<br>這些方法被首選為標準。 |  |
| as long as <button @click="speak('as long as')" title="發音" class="pronounce-btn">🔊</button> | 只要 | You can go as long as you finish your work.<br>只要你完成工作就可以去。 |  |
| as much as possible <button @click="speak('as much as possible')" title="發音" class="pronounce-btn">🔊</button> | 盡可能地 | Try to save as much as possible.<br>盡量多存一點。 |  |
| as shown <button @click="speak('as shown')" title="發音" class="pronounce-btn">🔊</button> | 如圖所示 / 如下所示 | Configure the settings as shown below.<br>如下圖所示設定選項。 |  |
| as you may have guessed <button @click="speak('as you may have guessed')" title="發音" class="pronounce-btn">🔊</button> | 正如你可能已經猜到的 | As you may have guessed, he won the prize.<br>正如你可能猜到的，他得獎了。 |  |
| aspects <button @click="speak('aspects')" title="發音" class="pronounce-btn">🔊</button> | 各方面 / 層面 | We need to consider all aspects.<br>我們需要考慮各方面。 |  |
| audit <button @click="speak('audit')" title="發音" class="pronounce-btn">🔊</button> | 審核 / 稽核 | The system keeps an audit log.<br>系統保留了審核日誌。 |  |
| author <button @click="speak('author')" title="發音" class="pronounce-btn">🔊</button> | 撰寫、編寫、開發、建立 | She is the author of this plugin.<br>她是這個外掛的開發者。 | 作為動詞時，在技術文件中常翻為「編寫」或「建立」。 |
| beforehand <button @click="speak('beforehand')" title="發音" class="pronounce-btn">🔊</button> | 事先 / 提前 | Please let me know beforehand.<br>請事先讓我知道。 |  |
| benefit <button @click="speak('benefit')" title="發音" class="pronounce-btn">🔊</button> | 益處 / 好處 | There are many benefits to this approach.<br>這種方法有很多好處。 |  |
| besides <button @click="speak('besides')" title="發音" class="pronounce-btn">🔊</button> | 還有，並且 / 此外 | Besides this, we have other options.<br>除此之外，我們還有其他選項。 |  |
| bloat <button @click="speak('bloat')" title="發音" class="pronounce-btn">🔊</button> | 膨脹 | This will add unnecessary bloat to the codebase.<br>這會為程式碼庫增加不必要的膨脹。 | 技術上常指程式碼過於肥大。 |
| bloated <button @click="speak('bloated')" title="發音" class="pronounce-btn">🔊</button> | 臃腫的 | The software has become bloated over time.<br>這軟體隨著時間變得臃腫了。 |  |
| boilerplate <button @click="speak('boilerplate')" title="發音" class="pronounce-btn">🔊</button> | 樣板程式碼 | The framework reduces boilerplate code.<br>這個框架減少了樣板程式碼。 | 指需要重複撰寫的基礎或標準程式碼。 |
| bound value <button @click="speak('bound value')" title="發音" class="pronounce-btn">🔊</button> | 綁定的值 | The bound value updates automatically.<br>綁定的值會自動更新。 |  |
| briefly <button @click="speak('briefly')" title="發音" class="pronounce-btn">🔊</button> | 簡要地 | Let me explain this briefly.<br>讓我簡要地解釋一下。 |  |
| callouts <button @click="speak('callouts')" title="發音" class="pronounce-btn">🔊</button> | 標註 / 提示框 | Pay attention to the callouts in the document.<br>請注意文件中的標註提示。 |  |
| certain <button @click="speak('certain')" title="發音" class="pronounce-btn">🔊</button> | 某些、特定 | Under certain conditions, it fails.<br>在特定條件下，它會失敗。 |  |
| cluttered <button @click="speak('cluttered')" title="發音" class="pronounce-btn">🔊</button> | 雜亂的 | The desk is very cluttered.<br>桌子非常雜亂。 |  |
| coerce <button @click="speak('coerce')" title="發音" class="pronounce-btn">🔊</button> | 強制轉換 | JavaScript will coerce the string to a number.<br>JavaScript 會將字串強制轉換為數字。 | 在程式中通常指隱式的型別轉換。 |
| coloured <button @click="speak('coloured')" title="發音" class="pronounce-btn">🔊</button> | 有色的 | The text is brightly coloured.<br>文字呈現鮮豔的色彩。 |  |
| come with <button @click="speak('come with')" title="發音" class="pronounce-btn">🔊</button> | 附帶 | The car comes with a warranty.<br>這輛車附帶保固。 |  |
| compliant <button @click="speak('compliant')" title="發音" class="pronounce-btn">🔊</button> | 合規的 / 遵循標準的 | The code is compliant with the standard.<br>這程式碼符合標準。 |  |
| comprehensive <button @click="speak('comprehensive')" title="發音" class="pronounce-btn">🔊</button> | 全方位的、綜合的 | This is a comprehensive guide.<br>這是一份綜合指南。 |  |
| concatenate <button @click="speak('concatenate')" title="發音" class="pronounce-btn">🔊</button> | 連接 / 串接 | We concatenate the two strings.<br>我們將這兩個字串連接起來。 | 技術上常指字串或檔案的拼接。 |
| condensed <button @click="speak('condensed')" title="發音" class="pronounce-btn">🔊</button> | 濃縮版 / 簡化的 | This is a condensed version of the book.<br>這是這本書的濃縮版。 |  |
| conditional <button @click="speak('conditional')" title="發音" class="pronounce-btn">🔊</button> | 有條件的 | This is a conditional statement.<br>這是一個有條件的陳述式。 |  |
| conform <button @click="speak('conform')" title="發音" class="pronounce-btn">🔊</button> | 符合 / 遵守 | The design must conform to the guidelines.<br>設計必須符合準則。 |  |
| congestion <button @click="speak('congestion')" title="發音" class="pronounce-btn">🔊</button> | 壅塞，過剩 | There is network congestion.<br>網路出現壅塞。 |  |
| conjunction <button @click="speak('conjunction')" title="發音" class="pronounce-btn">🔊</button> | 連接詞 / 結合 | Used in conjunction with other tools.<br>與其他工具結合使用。 | in conjunction with: 與...結合使用。 |
| consistency <button @click="speak('consistency')" title="發音" class="pronounce-btn">🔊</button> | 一致性 | Consistency is key to a good design.<br>一致性是優良設計的關鍵。 |  |
| consistently <button @click="speak('consistently')" title="發音" class="pronounce-btn">🔊</button> | 始終 / 一貫地 | It performs consistently well.<br>它始終表現良好。 |  |
| consult <button @click="speak('consult')" title="發音" class="pronounce-btn">🔊</button> | 查閱 / 諮詢 / 參考 | Please consult the documentation.<br>請參考文件。 | 在文件中通常翻譯為「查閱」或「參考」。 |
| crawl <button @click="speak('crawl')" title="發音" class="pronounce-btn">🔊</button> | 爬行 / 抓取 | The bot will crawl the website.<br>機器人將會抓取該網站。 | 常指爬蟲工具抓取資料。 |
| credential <button @click="speak('credential')" title="發音" class="pronounce-btn">🔊</button> | 憑證 | Please enter your credentials.<br>請輸入您的憑證。 |  |
| creep in <button @click="speak('creep in')" title="發音" class="pronounce-btn">🔊</button> | 慢慢出現 / 潛入 | Errors can creep in over time.<br>錯誤可能會隨著時間慢慢出現。 |  |
| dealing with <button @click="speak('dealing with')" title="發音" class="pronounce-btn">🔊</button> | 處理 / 應付 | We are dealing with a complex problem.<br>我們正在處理一個複雜的問題。 |  |
| denote <button @click="speak('denote')" title="發音" class="pronounce-btn">🔊</button> | 表示 | The star denotes a required field.<br>星號表示必填欄位。 |  |
| deprecated <button @click="speak('deprecated')" title="發音" class="pronounce-btn">🔊</button> | 已棄用 / 不推薦使用 | This function is now deprecated.<br>這個函數現在已經被棄用。 | 表示該功能未來將會移除，建議不要使用。 |
| derive <button @click="speak('derive')" title="發音" class="pronounce-btn">🔊</button> | 衍生 / 導出 | The class is derived from a base class.<br>這個類別衍生自一個基礎類別。 |  |
| descendant component <button @click="speak('descendant component')" title="發音" class="pronounce-btn">🔊</button> | 後代元件 | It passes data to the descendant component.<br>它將資料傳遞給後代元件。 |  |
| designated <button @click="speak('designated')" title="發音" class="pronounce-btn">🔊</button> | 指定的 | Please park in the designated area.<br>請停在指定區域。 |  |
| deteriorate <button @click="speak('deteriorate')" title="發音" class="pronounce-btn">🔊</button> | 惡化 | The performance will deteriorate.<br>效能將會惡化。 |  |
| differentiates <button @click="speak('differentiates')" title="發音" class="pronounce-btn">🔊</button> | 區分 | This feature differentiates our product.<br>這個功能區分了我們的產品。 |  |
| discover <button @click="speak('discover')" title="發音" class="pronounce-btn">🔊</button> | 發現 | You will discover new ways to code.<br>你將會發現新的寫程式方式。 |  |
| diverse <button @click="speak('diverse')" title="發音" class="pronounce-btn">🔊</button> | 各種各樣的、多樣性 | We have a diverse team.<br>我們有一個多樣化的團隊。 |  |
| document <button @click="speak('document')" title="發音" class="pronounce-btn">🔊</button> | 紀錄 / 文件化 | Make sure to document your code.<br>請確保為你的程式碼編寫文件紀錄。 | 當動詞時翻譯為「紀錄」或「編寫文件」。 |
| doubt <button @click="speak('doubt')" title="發音" class="pronounce-btn">🔊</button> | 懷疑 | I doubt that it will work.<br>我懷疑那會不會成功。 |  |
| drastically <button @click="speak('drastically')" title="發音" class="pronounce-btn">🔊</button> | 急劇地 | The speed increased drastically.<br>速度急劇地提升了。 |  |
| eagerly <button @click="speak('eagerly')" title="發音" class="pronounce-btn">🔊</button> | 急切地 / 熱切地 | The program eagerly loads the modules.<br>程式急切地載入模組。 |  |
| eliminated <button @click="speak('eliminated')" title="發音" class="pronounce-btn">🔊</button> | 淘汰 / 消除 | The bug was finally eliminated.<br>這個錯誤終於被消除了。 |  |
| embed <button @click="speak('embed')" title="發音" class="pronounce-btn">🔊</button> | 嵌入 | You can embed the video in your page.<br>你可以把影片嵌入你的頁面。 |  |
| encounter <button @click="speak('encounter')" title="發音" class="pronounce-btn">🔊</button> | 遭遇，遇到 | You might encounter some errors.<br>你可能會遇到一些錯誤。 |  |
| enforce <button @click="speak('enforce')" title="發音" class="pronounce-btn">🔊</button> | 執行 / 強制 | The linter will enforce these rules.<br>Linter 將強制執行這些規則。 |  |
| evolve <button @click="speak('evolve')" title="發音" class="pronounce-btn">🔊</button> | 發展 / 逐步演進 | The API will evolve over time.<br>API 會隨著時間發展演進。 |  |
| exceptional <button @click="speak('exceptional')" title="發音" class="pronounce-btn">🔊</button> | 非凡的 / 例外的 | The quality is exceptional.<br>品質是非凡的。 |  |
| exclusively <button @click="speak('exclusively')" title="發音" class="pronounce-btn">🔊</button> | 專門用於 / 僅限 | It is used exclusively for testing.<br>它專門用於測試。 | 翻譯為「完全只...」能強調專一性。 |
| explore <button @click="speak('explore')" title="發音" class="pronounce-btn">🔊</button> | 探索 | Let's explore this new feature.<br>讓我們探索這個新功能。 |  |
| extremely <button @click="speak('extremely')" title="發音" class="pronounce-btn">🔊</button> | 極度 | It is extremely fast.<br>它極度快速。 |  |
| extremely diverse <button @click="speak('extremely diverse')" title="發音" class="pronounce-btn">🔊</button> | 極為多樣化 | The ecosystem is extremely diverse.<br>這個生態系統極為多樣化。 |  |
| flattened <button @click="speak('flattened')" title="發音" class="pronounce-btn">🔊</button> | 扁平的 | The array can be flattened.<br>這個陣列可以被扁平化。 |  |
| flexible <button @click="speak('flexible')" title="發音" class="pronounce-btn">🔊</button> | 靈活的 | The layout is very flexible.<br>版面配置非常靈活。 |  |
| framework agnostic <button @click="speak('framework agnostic')" title="發音" class="pronounce-btn">🔊</button> | 與框架無關 | The library is framework agnostic.<br>這函式庫與框架無關。 | 表示該工具可以用於任何前端框架。 |
| fundamental <button @click="speak('fundamental')" title="發音" class="pronounce-btn">🔊</button> | 基礎的、十分重要 | This is a fundamental concept.<br>這是一個基礎的概念。 |  |
| future proof <button @click="speak('future proof')" title="發音" class="pronounce-btn">🔊</button> | 面向未來 / 具備未來兼容性 | The design is future proof.<br>這個設計是面向未來的。 |  |
| gained along <button @click="speak('gained along')" title="發音" class="pronounce-btn">🔊</button> | 一路走來所獲得的 | Experience gained along the way is valuable.<br>一路走來獲得的經驗是很寶貴的。 |  |
| generic <button @click="speak('generic')" title="發音" class="pronounce-btn">🔊</button> | 通用的 / 泛型 | We use a generic type here.<br>我們在這裡使用通用型別。 | 在程式語言常指「泛型」。 |
| get a taste <button @click="speak('get a taste')" title="發音" class="pronounce-btn">🔊</button> | 體驗、感受、見識 | Get a taste of the new UI.<br>體驗一下新的 UI。 |  |
| get a walkthrough <button @click="speak('get a walkthrough')" title="發音" class="pronounce-btn">🔊</button> | 功能導覽、新手教學 | Let's get a walkthrough of the features.<br>讓我們來進行功能導覽。 |  |
| get involved <button @click="speak('get involved')" title="發音" class="pronounce-btn">🔊</button> | 介入、參與 | We encourage you to get involved.<br>我們鼓勵你參與其中。 |  |
| get the most out of <button @click="speak('get the most out of')" title="發音" class="pronounce-btn">🔊</button> | 充分利用 | How to get the most out of this tool.<br>如何充分利用這個工具。 |  |
| given that <button @click="speak('given that')" title="發音" class="pronounce-btn">🔊</button> | 鑑於 / 考慮到 | Given that it is free, it is quite good.<br>鑑於它是免費的，它已經很不錯了。 |  |
| gradually <button @click="speak('gradually')" title="發音" class="pronounce-btn">🔊</button> | 逐步地 | You can adopt it gradually.<br>你可以逐步地導入它。 |  |
| grasp <button @click="speak('grasp')" title="發音" class="pronounce-btn">🔊</button> | 掌握、領會 | It is easy to grasp the idea.<br>很容易掌握這個概念。 |  |
| great fit <button @click="speak('great fit')" title="發音" class="pronounce-btn">🔊</button> | 非常適合 | Vite is a great fit for modern apps.<br>Vite 非常適合現代應用程式。 |  |
| greet <button @click="speak('greet')" title="發音" class="pronounce-btn">🔊</button> | 問候 / 迎接 | The app will greet the user.<br>應用程式將會問候使用者。 |  |
| have access to <button @click="speak('have access to')" title="發音" class="pronounce-btn">🔊</button> | 可以存取 / 能夠使用 | You have access to the full API.<br>你可以存取完整的 API。 |  |
| hence <button @click="speak('hence')" title="發音" class="pronounce-btn">🔊</button> | 因此 | It is fast, hence its popularity.<br>它很快，因此很受歡迎。 |  |
| heuristics <button @click="speak('heuristics')" title="發音" class="pronounce-btn">🔊</button> | 啟發式方法 | It uses heuristics to guess the type.<br>它使用啟發式方法來猜測類型。 |  |
| hydration <button @click="speak('hydration')" title="發音" class="pronounce-btn">🔊</button> | 激活 / 狀態注水 | Client-side hydration can be slow.<br>客戶端激活可能會很慢。 | 前端 SSR 術語，常直接保留英文或譯為「激活」。 |
| hyphen <button @click="speak('hyphen')" title="發音" class="pronounce-btn">🔊</button> | 連字符 | Use a hyphen to separate words.<br>使用連字符來分隔單字。 |  |
| identical <button @click="speak('identical')" title="發音" class="pronounce-btn">🔊</button> | 完全相同的 | The results are almost identical.<br>結果幾乎完全相同。 |  |
| immutable <button @click="speak('immutable')" title="發音" class="pronounce-btn">🔊</button> | 不可變的 / 無法修改的 | The state is immutable.<br>狀態是不可修改的。 |  |
| in a nutshell <button @click="speak('in a nutshell')" title="發音" class="pronounce-btn">🔊</button> | 簡言之 | In a nutshell, it is faster.<br>簡言之，它更快。 |  |
| in action <button @click="speak('in action')" title="發音" class="pronounce-btn">🔊</button> | 實際行動/實際情況 | Let's see the code in action.<br>讓我們看看程式碼的實際執行情況。 |  |
| in advance <button @click="speak('in advance')" title="發音" class="pronounce-btn">🔊</button> | 提早，事先 | Please build the assets in advance.<br>請事先建置資源。 |  |
| in short <button @click="speak('in short')" title="發音" class="pronounce-btn">🔊</button> | 簡而言之 | In short, you don't need it.<br>簡而言之，你不需要它。 |  |
| in spite of <button @click="speak('in spite of')" title="發音" class="pronounce-btn">🔊</button> | 儘管 | It runs well in spite of the bugs.<br>儘管有錯誤，它仍然運作良好。 |  |
| in sync with <button @click="speak('in sync with')" title="發音" class="pronounce-btn">🔊</button> | 與……同步 | Keep the data in sync with the server.<br>保持資料與伺服器同步。 |  |
| inaccurate <button @click="speak('inaccurate')" title="發音" class="pronounce-btn">🔊</button> | 不準確 | The result might be inaccurate.<br>結果可能不準確。 |  |
| inbound <button @click="speak('inbound')" title="發音" class="pronounce-btn">🔊</button> | 入站 / 進來的 | Check the inbound network traffic.<br>檢查入站的網路流量。 |  |
| incrementally adoptable <button @click="speak('incrementally adoptable')" title="發音" class="pronounce-btn">🔊</button> | 可漸進式導入的 | Vue is incrementally adoptable.<br>Vue 是可漸進式導入的。 |  |
| indicate <button @click="speak('indicate')" title="發音" class="pronounce-btn">🔊</button> | 顯示 / 表明 / 指出 | The icon indicates a warning.<br>該圖示表明有警告。 |  |
| inferred <button @click="speak('inferred')" title="發音" class="pronounce-btn">🔊</button> | 推論 / 推斷 | The type is inferred automatically.<br>型別會自動被推論。 |  |
| inspired <button @click="speak('inspired')" title="發音" class="pronounce-btn">🔊</button> | 啟發 / 受...啟發 | It is inspired by snowpack.<br>它是受到 snowpack 的啟發。 |  |
| instruct <button @click="speak('instruct')" title="發音" class="pronounce-btn">🔊</button> | 指示 | Instruct the compiler to ignore this.<br>指示編譯器忽略這個。 |  |
| intend to <button @click="speak('intend to')" title="發音" class="pronounce-btn">🔊</button> | 打算 / 想要 | We intend to support this later.<br>我們打算稍後支援這個。 |  |
| intensive <button @click="speak('intensive')" title="發音" class="pronounce-btn">🔊</button> | 密集的 | It handles CPU intensive tasks.<br>它處理 CPU 密集的任務。 |  |
| intentional <button @click="speak('intentional')" title="發音" class="pronounce-btn">🔊</button> | 故意的 / 有意的 | This behavior is intentional.<br>這個行為是有意的。 |  |
| interfere with <button @click="speak('interfere with')" title="發音" class="pronounce-btn">🔊</button> | 妨礙 ，干擾 | It does not interfere with your setup.<br>它不會干擾你的設定。 |  |
| interpolation <button @click="speak('interpolation')" title="發音" class="pronounce-btn">🔊</button> | 插值 | String interpolation is supported.<br>支援字串插值。 | 字串或模板中的變數替換。 |
| interpret <button @click="speak('interpret')" title="發音" class="pronounce-btn">🔊</button> | 解釋 / 直譯 | How to interpret the error message.<br>如何解釋這個錯誤訊息。 |  |
| intimidating <button @click="speak('intimidating')" title="發音" class="pronounce-btn">🔊</button> | 令人畏懼的 | The source code can be intimidating.<br>原始碼可能會令人畏懼。 |  |
| intrinsic <button @click="speak('intrinsic')" title="發音" class="pronounce-btn">🔊</button> | 固有的 / 內建的 | It is an intrinsic part of the system.<br>它是系統固有的部分。 |  |
| invest <button @click="speak('invest')" title="發音" class="pronounce-btn">🔊</button> | 投資 | Invest time in learning it.<br>投資時間學習它。 |  |
| invoke <button @click="speak('invoke')" title="發音" class="pronounce-btn">🔊</button> | 調用 / 呼叫 | You can invoke the function directly.<br>你可以直接調用這個函數。 |  |
| is condensed into <button @click="speak('is condensed into')" title="發音" class="pronounce-btn">🔊</button> | 精簡為、簡化為 | The logic is condensed into one line.<br>邏輯被精簡為一行。 |  |
| is considered <button @click="speak('is considered')" title="發音" class="pronounce-btn">🔊</button> | 被認為是 | It is considered a best practice.<br>這被認為是最佳實踐。 |  |
| keep in mind <button @click="speak('keep in mind')" title="發音" class="pronounce-btn">🔊</button> | 牢記 | Keep in mind that this is beta.<br>牢記這是測試版。 |  |
| later on <button @click="speak('later on')" title="發音" class="pronounce-btn">🔊</button> | 稍後 / 後續 | We will fix this later on.<br>我們稍後會修復這個。 |  |
| latter <button @click="speak('latter')" title="發音" class="pronounce-btn">🔊</button> | 後者 | I prefer the latter option.<br>我偏好後者選項。 |  |
| left as is <button @click="speak('left as is')" title="發音" class="pronounce-btn">🔊</button> | 保持原樣 | The file is left as is.<br>檔案保持原樣。 |  |
| leverage <button @click="speak('leverage')" title="發音" class="pronounce-btn">🔊</button> | 善用 / 充分利用 / 發揮優勢 | We leverage Vite for fast builds.<br>我們利用 Vite 進行快速建置。 | 在技術文章中常譯為「利用」。 |
| lies in <button @click="speak('lies in')" title="發音" class="pronounce-btn">🔊</button> | 在於 | The difference lies in how it runs.<br>差異在於它如何運作。 |  |
| look out <button @click="speak('look out')" title="發音" class="pronounce-btn">🔊</button> | 當心，留意 | Look out for breaking changes.<br>當心破壞性變更。 |  |
| made possible <button @click="speak('made possible')" title="發音" class="pronounce-btn">🔊</button> | 得益於…… / 成為可能 | This is made possible by esbuild.<br>這是得益於 esbuild 才成為可能的。 |  |
| manipulation <button @click="speak('manipulation')" title="發音" class="pronounce-btn">🔊</button> | 操縱 / 操作 | DOM manipulation can be slow.<br>DOM 操縱可能會很慢。 |  |
| markup <button @click="speak('markup')" title="發音" class="pronounce-btn">🔊</button> | 標記 | Write the HTML markup.<br>編寫 HTML 標記。 | 如 HTML (HyperText Markup Language)。 |
| mature <button @click="speak('mature')" title="發音" class="pronounce-btn">🔊</button> | 成熟 | The ecosystem is mature.<br>生態系統很成熟。 |  |
| meant for <button @click="speak('meant for')" title="發音" class="pronounce-btn">🔊</button> | 專門設計用來 | This tool is meant for developers.<br>這個工具是專門設計給開發者用的。 | A is meant for B ，A 是「專門設計用來」做 B 的。 |
| migrate <button @click="speak('migrate')" title="發音" class="pronounce-btn">🔊</button> | 遷移 | How to migrate from webpack.<br>如何從 webpack 遷移。 |  |
| miss out <button @click="speak('miss out')" title="發音" class="pronounce-btn">🔊</button> | 錯過 | Don't miss out on these features.<br>不要錯過這些功能。 |  |
| modularized fashion <button @click="speak('modularized fashion')" title="發音" class="pronounce-btn">🔊</button> | 模組化的方式 | Code is written in a modularized fashion.<br>程式碼以模組化的方式編寫。 |  |
| multilingual <button @click="speak('multilingual')" title="發音" class="pronounce-btn">🔊</button> | 多種語言的 | It supports multilingual sites.<br>它支援多種語言的網站。 |  |
| mustache <button @click="speak('mustache')" title="發音" class="pronounce-btn">🔊</button> | 大括號 | Vue uses mustache syntax.<br>Vue 使用大括號語法。 | 在前端常指 {{ }} 這種模板語法。 |
| mutate <button @click="speak('mutate')" title="發音" class="pronounce-btn">🔊</button> | 變更 / 異動 | Do not mutate the state directly.<br>不要直接變更狀態。 | 常指直接修改物件的狀態。 |
| noticeably <button @click="speak('noticeably')" title="發音" class="pronounce-btn">🔊</button> | 明顯地 | The build is noticeably faster.<br>建置速度明顯地變快了。 |  |
| observation cost <button @click="speak('observation cost')" title="發音" class="pronounce-btn">🔊</button> | 觀察成本 / 監聽成本 | It reduces the observation cost.<br>它降低了監聽成本。 |  |
| omit <button @click="speak('omit')" title="發音" class="pronounce-btn">🔊</button> | 忽略 / 省略 | You can omit the extension.<br>你可以忽略副檔名。 |  |
| on a regular basis <button @click="speak('on a regular basis')" title="發音" class="pronounce-btn">🔊</button> | 定期 | Update the package on a regular basis.<br>定期更新套件。 |  |
| on top of that <button @click="speak('on top of that')" title="發音" class="pronounce-btn">🔊</button> | 除此之外 / 更重要的是 | And on top of that, it is free.<br>除此之外，它是免費的。 |  |
| only have access to <button @click="speak('only have access to')" title="發音" class="pronounce-btn">🔊</button> | 只能存取 | You only have access to public files.<br>你只能存取公開的檔案。 |  |
| opinionated <button @click="speak('opinionated')" title="發音" class="pronounce-btn">🔊</button> | 主觀的 / 有明確規範的 | It is an opinionated framework.<br>這是一個主觀的框架。 | 指框架或工具自帶一套強制或強烈建議的作法。 |
| opinionated feature <button @click="speak('opinionated feature')" title="發音" class="pronounce-btn">🔊</button> | 主觀特徵 | This is an opinionated feature.<br>這是一個主觀的特徵。 |  |
| opportunity <button @click="speak('opportunity')" title="發音" class="pronounce-btn">🔊</button> | 機會 | This is a good opportunity.<br>這是一個好機會。 |  |
| opposite <button @click="speak('opposite')" title="發音" class="pronounce-btn">🔊</button> | 對面的 / 相反的 | It works in the opposite way.<br>它以相反的方式運作。 |  |
| opt-out <button @click="speak('opt-out')" title="發音" class="pronounce-btn">🔊</button> | 選擇不使用 / 選擇退出 | You can opt-out of this behavior.<br>你可以選擇不使用這個行為。 |  |
| over time <button @click="speak('over time')" title="發音" class="pronounce-btn">🔊</button> | 隨著時間的推移 | It improves over time.<br>它隨著時間的推移而改善。 |  |
| overhead <button @click="speak('overhead')" title="發音" class="pronounce-btn">🔊</button> | 額外開銷 / 系統開銷 | It adds zero overhead.<br>它沒有增加額外開銷。 |  |
| paired with <button @click="speak('paired with')" title="發音" class="pronounce-btn">🔊</button> | 搭配 | Best when paired with Vue.<br>搭配 Vue 使用時效果最佳。 |  |
| patterns <button @click="speak('patterns')" title="發音" class="pronounce-btn">🔊</button> | 模式 | Follow these design patterns.<br>遵循這些設計模式。 |  |
| pinpoint <button @click="speak('pinpoint')" title="發音" class="pronounce-btn">🔊</button> | 找出、查明 | It helps to pinpoint the error.<br>這有助於查明錯誤。 |  |
| pragmatic <button @click="speak('pragmatic')" title="發音" class="pronounce-btn">🔊</button> | 務實的 | We took a pragmatic approach.<br>我們採取了務實的方法。 |  |
| precedence <button @click="speak('precedence')" title="發音" class="pronounce-btn">🔊</button> | 優先權 / 優先順序 | Local config takes precedence.<br>本機設定具有優先權。 |  |
| prepended <button @click="speak('prepended')" title="發音" class="pronounce-btn">🔊</button> | 前置 / 添加到開頭 | The script is prepended to the head.<br>這個腳本被前置到了 head 裡。 |  |
| prerequisites <button @click="speak('prerequisites')" title="發音" class="pronounce-btn">🔊</button> | 先修條件 / 先決條件 | Please install the prerequisites.<br>請安裝先修條件(套件)。 |  |
| presence <button @click="speak('presence')" title="發音" class="pronounce-btn">🔊</button> | 存在狀態 / 登場 | It animates the presence of the element.<br>它為元素的登場與退場加入動畫。 |  |
| present in <button @click="speak('present in')" title="發音" class="pronounce-btn">🔊</button> | 存在於 | This bug is present in older versions.<br>這個錯誤存在於舊版本中。 |  |
| primitives <button @click="speak('primitives')" title="發音" class="pronounce-btn">🔊</button> | 基礎原語 / 基本型態 | It provides low-level primitives.<br>它提供了低階的基礎原語。 |  |
| prior <button @click="speak('prior')" title="發音" class="pronounce-btn">🔊</button> | 先前的 | Do this prior to building.<br>在建置之前執行這個。 |  |
| probably better <button @click="speak('probably better')" title="發音" class="pronounce-btn">🔊</button> | 可能比較好 / 通常更為理想 | It is probably better to use CSS.<br>使用 CSS 可能比較好。 |  |
| prompts <button @click="speak('prompts')" title="發音" class="pronounce-btn">🔊</button> | 提示 | Follow the CLI prompts.<br>遵循命令列的提示。 |  |
| propagation <button @click="speak('propagation')" title="發音" class="pronounce-btn">🔊</button> | 傳播 | Stop event propagation.<br>停止事件傳播。 | 事件冒泡(event propagation)。 |
| purged <button @click="speak('purged')" title="發音" class="pronounce-btn">🔊</button> | 清除 | Unused CSS is purged.<br>未使用的 CSS 會被清除。 |  |
| rationale <button @click="speak('rationale')" title="發音" class="pronounce-btn">🔊</button> | 理由，解釋 / 基本原理 | Read the rationale behind this design.<br>閱讀這個設計背後的基本原理。 |  |
| reactivity fundamentals <button @click="speak('reactivity fundamentals')" title="發音" class="pronounce-btn">🔊</button> | 響應式的基本原理 | Learn the reactivity fundamentals.<br>學習響應式的基本原理。 |  |
| read along <button @click="speak('read along')" title="發音" class="pronounce-btn">🔊</button> | 跟讀 / 跟著讀 | You can read along with the code.<br>你可以跟著程式碼一起讀。 |  |
| recommended conventions <button @click="speak('recommended conventions')" title="發音" class="pronounce-btn">🔊</button> | 建議慣例 | These are the recommended conventions.<br>這些是建議的慣例。 |  |
| reflect <button @click="speak('reflect')" title="發音" class="pronounce-btn">🔊</button> | 反映 | The DOM will reflect the state.<br>DOM 將反映這個狀態。 |  |
| regardless of <button @click="speak('regardless of')" title="發音" class="pronounce-btn">🔊</button> | 不論 / 不管 | Fast regardless of app size.<br>不論應用程式大小都很快。 |  |
| regression <button @click="speak('regression')" title="發音" class="pronounce-btn">🔊</button> | 回歸 / 軟體退化 | This fixes a regression bug.<br>這修復了一個回歸錯誤。 | 常指更新後舊功能壞掉的情況 (regression bug)。 |
| relatively <button @click="speak('relatively')" title="發音" class="pronounce-btn">🔊</button> | 相對地 | It is relatively easy to use.<br>它相對地容易使用。 |  |
| relevant <button @click="speak('relevant')" title="發音" class="pronounce-btn">🔊</button> | 相關的 | Only import relevant code.<br>只引入相關的程式碼。 |  |
| requisite <button @click="speak('requisite')" title="發音" class="pronounce-btn">🔊</button> | 必備條件 / 必需品 | Node is a requisite for Vite.<br>Node 是 Vite 的必備條件。 |  |
| respective <button @click="speak('respective')" title="發音" class="pronounce-btn">🔊</button> | 各自的 | They are inside their respective folders.<br>它們位在各自的資料夾中。 |  |
| retain <button @click="speak('retain')" title="發音" class="pronounce-btn">🔊</button> | 保持 / 保留 | It will retain its value.<br>它將保持它的值。 |  |
| rough estimate <button @click="speak('rough estimate')" title="發音" class="pronounce-btn">🔊</button> | 粗略估計 | Here is a rough estimate.<br>這是一個粗略估計。 |  |
| sensible <button @click="speak('sensible')" title="發音" class="pronounce-btn">🔊</button> | 合理的 / 明智的 | Vite has sensible defaults.<br>Vite 有合理的預設值。 |  |
| shallow <button @click="speak('shallow')" title="發音" class="pronounce-btn">🔊</button> | 淺的 | It performs a shallow comparison.<br>它執行淺層比較。 | 如 shallow copy 淺拷貝。 |
| ship with <button @click="speak('ship with')" title="發音" class="pronounce-btn">🔊</button> | 附帶 / 內建 | It ships with TypeScript support.<br>它內建附帶 TypeScript 支援。 |  |
| shortened <button @click="speak('shortened')" title="發音" class="pronounce-btn">🔊</button> | 縮短 | The URL is shortened.<br>網址被縮短了。 |  |
| so that <button @click="speak('so that')" title="發音" class="pronounce-btn">🔊</button> | 以便 | Cache it so that it loads faster.<br>快取它以便載入更快。 |  |
| specifically <button @click="speak('specifically')" title="發音" class="pronounce-btn">🔊</button> | 具體來說 | This is specifically designed for speed.<br>這是具體來說為了速度而設計的。 |  |
| spin up <button @click="speak('spin up')" title="發音" class="pronounce-btn">🔊</button> | 啟動 / 快速建立 | Spin up a dev server in seconds.<br>在幾秒內啟動開發伺服器。 |  |
| staging mode <button @click="speak('staging mode')" title="發音" class="pronounce-btn">🔊</button> | 暫存模式 / 測試環境模式 | Test it in staging mode.<br>在暫存模式下測試它。 |  |
| stalled <button @click="speak('stalled')" title="發音" class="pronounce-btn">🔊</button> | 停滯 | The project was stalled.<br>專案停滯了。 |  |
| straightforward <button @click="speak('straightforward')" title="發音" class="pronounce-btn">🔊</button> | 直接了當 / 簡單明瞭的 | The setup is straightforward.<br>設定簡單明瞭。 |  |
| strive <button @click="speak('strive')" title="發音" class="pronounce-btn">🔊</button> | 努力、奮鬥 | We strive for better performance.<br>我們努力追求更好的效能。 |  |
| stuff <button @click="speak('stuff')" title="發音" class="pronounce-btn">🔊</button> | 東西 / 物品 | It handles all the internal stuff.<br>它處理所有內部的事情。 |  |
| subsequent <button @click="speak('subsequent')" title="發音" class="pronounce-btn">🔊</button> | 隨後的 / 後續的 | Subsequent updates are fast.<br>後續的更新很快。 |  |
| suffix <button @click="speak('suffix')" title="發音" class="pronounce-btn">🔊</button> | 後綴 | Add a hash suffix to the file.<br>為檔案加入一個雜湊後綴。 |  |
| sustainable <button @click="speak('sustainable')" title="發音" class="pronounce-btn">🔊</button> | 可持續的 | A sustainable open source project.<br>一個可持續的開源專案。 |  |
| syntactically <button @click="speak('syntactically')" title="發音" class="pronounce-btn">🔊</button> | 語法上 | It is syntactically correct.<br>這在語法上是正確的。 |  |
| tackle <button @click="speak('tackle')" title="發音" class="pronounce-btn">🔊</button> | 處理 / 應對 | How to tackle this problem.<br>如何處理這個問題。 |  |
| tailored <button @click="speak('tailored')" title="發音" class="pronounce-btn">🔊</button> | 量身訂製的 | A tailored experience for developers.<br>為開發者量身訂製的體驗。 |  |
| take shape <button @click="speak('take shape')" title="發音" class="pronounce-btn">🔊</button> | 成形 / 形成 | The app begins to take shape.<br>應用程式開始成形。 |  |
| tap into <button @click="speak('tap into')" title="發音" class="pronounce-btn">🔊</button> | 利用 / 深入挖掘 | Plugins can tap into the build process.<br>外掛可以切入利用建置過程。 |  |
| tend to <button @click="speak('tend to')" title="發音" class="pronounce-btn">🔊</button> | 傾向於 | Large apps tend to slow down.<br>大型應用程式傾向於變慢。 |  |
| think of <button @click="speak('think of')" title="發音" class="pronounce-btn">🔊</button> | 把……視為 / 想到 | Think of it as a bundler.<br>把它視為一個打包器。 |  |
| threshold <button @click="speak('threshold')" title="發音" class="pronounce-btn">🔊</button> | 臨界點 / 門檻 | It reaches the threshold.<br>它達到了臨界點。 |  |
| throughout <button @click="speak('throughout')" title="發音" class="pronounce-btn">🔊</button> | 到處，自始至終 | Used throughout the application.<br>自始至終在應用程式中使用。 |  |
| throughout the guide <button @click="speak('throughout the guide')" title="發音" class="pronounce-btn">🔊</button> | 在整篇指南中 | Mentioned throughout the guide.<br>在整篇指南中都有提到。 |  |
| tradeoff <button @click="speak('tradeoff')" title="發音" class="pronounce-btn">🔊</button> | 權衡 / 取捨 | There is a performance tradeoff.<br>這有一個效能上的權衡。 |  |
| trailing <button @click="speak('trailing')" title="發音" class="pronounce-btn">🔊</button> | 尾隨的 | Remove the trailing slash.<br>移除尾隨的斜線。 | 例如 trailing slash。 |
| trait <button @click="speak('trait')" title="發音" class="pronounce-btn">🔊</button> | 特徵 / 特點 | This is a common trait.<br>這是一個常見的特徵。 |  |
| transpile <button @click="speak('transpile')" title="發音" class="pronounce-btn">🔊</button> | 轉譯 | It uses esbuild to transpile TS.<br>它使用 esbuild 來轉譯 TS。 | 如將 TypeScript 轉譯成 JavaScript。 |
| treated as <button @click="speak('treated as')" title="發音" class="pronounce-btn">🔊</button> | 視為 / 被當作 | The file is treated as a module.<br>該檔案被視為一個模組。 |  |
| treats <button @click="speak('treats')" title="發音" class="pronounce-btn">🔊</button> | 處理 / 對待 | Vite treats HTML as the entry point.<br>Vite 將 HTML 視為進入點。 |  |
| truthiness <button @click="speak('truthiness')" title="發音" class="pronounce-btn">🔊</button> | 真值性 | Check the truthiness of the value.<br>檢查該值的真值性。 | 在 JS 中指轉為布林值時為 true 的特性。 |
| tucked away <button @click="speak('tucked away')" title="發音" class="pronounce-btn">🔊</button> | 隱藏於 / 藏起來 | The logic is tucked away inside.<br>邏輯隱藏在裡面。 |  |
| under the hood <button @click="speak('under the hood')" title="發音" class="pronounce-btn">🔊</button> | 在底層 / 幕後 | Under the hood, it uses Rollup.<br>在底層，它使用了 Rollup。 |  |
| underlying <button @click="speak('underlying')" title="發音" class="pronounce-btn">🔊</button> | 潛在的 / 底層的 | The underlying logic is the same.<br>底層的邏輯是一樣的。 |  |
| underneath it <button @click="speak('underneath it')" title="發音" class="pronounce-btn">🔊</button> | 在它下面 / 隱藏在其後 | Look underneath it for details.<br>在它下面尋找細節。 |  |
| unopinionated <button @click="speak('unopinionated')" title="發音" class="pronounce-btn">🔊</button> | 不帶偏見的 / 非強制性的 | It is highly unopinionated.<br>它是非常不帶偏見的(沒有強制規範的)。 |  |
| unreasonably <button @click="speak('unreasonably')" title="發音" class="pronounce-btn">🔊</button> | 不合理地 | It becomes unreasonably slow.<br>它變得極不合理地緩慢。 |  |
| variants <button @click="speak('variants')" title="發音" class="pronounce-btn">🔊</button> | 變體 | Different button variants are available.<br>有不同的按鈕變體可用。 |  |
| vary <button @click="speak('vary')" title="發音" class="pronounce-btn">🔊</button> | 各不相同 / 變化 | The results may vary.<br>結果可能會各不相同。 |  |
| vary drastically <button @click="speak('vary drastically')" title="發音" class="pronounce-btn">🔊</button> | 差異巨大 | Requirements vary drastically.<br>需求有巨大的差異。 |  |
| verbose <button @click="speak('verbose')" title="發音" class="pronounce-btn">🔊</button> | 冗長的 / 囉唆的 | The logs are too verbose.<br>日誌太冗長了。 |  |
| veteran <button @click="speak('veteran')" title="發音" class="pronounce-btn">🔊</button> | 老將 / 經驗豐富者 | Even veteran developers like it.<br>即使是經驗豐富的老將開發者也喜歡它。 |  |
| walkthrough <button @click="speak('walkthrough')" title="發音" class="pronounce-btn">🔊</button> | 流程攻略 / 導覽 | Read the tutorial walkthrough.<br>閱讀教學流程攻略。 |  |
| willing to put up <button @click="speak('willing to put up')" title="發音" class="pronounce-btn">🔊</button> | 願意忍受 | Are you willing to put up with this?<br>你願意忍受這個嗎？ |  |
| with that in mind <button @click="speak('with that in mind')" title="發音" class="pronounce-btn">🔊</button> | 考慮到這一點 | With that in mind, let's continue.<br>考慮到這一點，我們繼續吧。 |  |
| within <button @click="speak('within')" title="發音" class="pronounce-btn">🔊</button> | 在...之內 | It runs within the browser.<br>它在瀏覽器之內執行。 |  |
| wonder <button @click="speak('wonder')" title="發音" class="pronounce-btn">🔊</button> | 想知道 | You might wonder why we need this.<br>你可能會想知道為什麼我們需要這個。 |  |
| you name it <button @click="speak('you name it')" title="發音" class="pronounce-btn">🔊</button> | 你能想到的(都有) | React, Vue, Svelte, you name it.<br>React, Vue, Svelte，你能想到的都有支援。 |  |

<style>
.pronounce-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1em;
  padding: 0;
  margin-left: 4px;
}
.pronounce-btn:hover {
  opacity: 0.8;
}
</style>
