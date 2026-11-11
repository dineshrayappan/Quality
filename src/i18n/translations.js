export const translations = {
  en: {
    appTitle: "Garment End-line QC",
    subtitle: "Apparel Export Quality Inspection System",
    
    // Navigation
    navQC: "QC Inspection",
    navTV: "TV Dashboard",
    navAnalytics: "Daily Analytics",
    navTechPacks: "Tech Packs",
    navDefects: "Defect Master",

    // Headers & selectors
    selectLine: "Select Line",
    selectStyle: "Select Tech Pack / Style",
    inspector: "QC Inspector",
    shift: "Shift",
    liveStatus: "Live End-line",

    // Daily Counters
    inspectedToday: "Today's Inspected",
    goodPieces: "Good Pieces (OK)",
    reworkPieces: "Rework / Defect",
    passRate: "Pass Rate",
    reworkRate: "Rework Rate",
    target: "Target",

    // Tablet QC Action Buttons
    btnOk: "PASS (OK)",
    btnOkSub: "Piece meets buyer quality specs",
    btnDefect: "DEFECT (REWORK)",
    btnDefectSub: "Pinpoint defect on Tech Pack",
    undoLast: "Undo Last Check",
    recentInspections: "Recent Inspected Pieces",

    // Defect Pinpoint Modal / Screen
    defectModalTitle: "Pinpoint Defect On Tech Pack",
    touchInstruction: "Tap on garment image to place defect pinpoint(s)",
    viewFront: "Front View",
    viewBack: "Back View",
    pinsPlaced: "Pins Placed",
    clearPins: "Clear All Pins",
    removePin: "Remove Pin",
    
    // Side defect multi-select
    selectDefectsLabel: "Select Defect Issues (Multi-select)",
    searchDefectPlaceholder: "Search defect or type new...",
    selectedDefects: "Selected Issues",
    addCustomDefectBtn: "+ Add New Defect Type",
    customDefectPlaceholder: "Enter new defect name...",
    saveCustomDefect: "Add To List",
    selectOperation: "Responsible Sewing Operation",
    defectSeverity: "Severity",
    notesPlaceholder: "Inspector notes (optional)...",
    btnSendToRework: "Confirm & Move To Rework",
    cancel: "Cancel",

    // TV Dashboard
    tvTitle: "SHOP-FLOOR LIVE QC DASHBOARD",
    tvTotalChecked: "Total Checked",
    tvGarmentHeatmap: "Garment Defect Heat Map",
    tvTopOperations: "Top Defect Operations (Root Causes)",
    tvDefectPie: "Defect Category Distribution",
    tvDefectPareto: "Defect Type Breakdown",
    tvHourlyRate: "Hourly Production & Quality Trend",
    tvLastUpdated: "Auto-refreshing every 5s",
    tvFullscreen: "Fullscreen TV Mode",

    // Analytics Page
    analyticsTitle: "End of Day QC Summary & Defect Analytics",
    filterDate: "Date",
    filterLine: "Production Line",
    filterStyle: "Style / PO",
    exportData: "Export CSV",
    pieChartTitle: "Defect Breakdown by Type (Percentage View)",
    pieChartSub: "Includes all standard & manually added defects",
    operationsChartTitle: "Defects by Sewing Operation",
    rank: "Rank",
    defectType: "Defect Type",
    occurrences: "Pieces Count",
    percentage: "Percentage %",
    category: "Category",
    allLines: "All Lines",
    allStyles: "All Styles",
    today: "Today",
    yesterday: "Yesterday",

    // Defect Master
    masterTitle: "Defect Type Library",
    masterSub: "Standard & manually added defect issues",
    searchPlaceholder: "Search defect name or code...",
    addDefect: "Create Defect Type",
    code: "Code",
    status: "Status",
    active: "Active",
    customDefectTag: "Manual Entry",

    // Alerts & Notifications
    piecePassSuccess: "Piece #{{id}} marked as PASS / OK",
    pieceDefectSuccess: "Piece sent to REWORK with {{count}} defect pin(s)",
    customDefectCreated: "New defect type created and added to dropdown!",
    undoSuccess: "Last check undone successfully",
  },

  ta: {
    appTitle: "ஆடை இறுதித்தரக் கட்டுப்பாடு (QC)",
    subtitle: "ஆடை ஏற்றுமதி இறுதி வரிசை ஆய்வு அமைப்பு",

    // Navigation
    navQC: "QC ஆய்வு (டேப்லெட்)",
    navTV: "டிவி திரை பலகை (TV)",
    navAnalytics: "தினசரி பகுப்பாய்வு",
    navTechPacks: "டெக் பேக் (Tech Pack)",
    navDefects: "குறைபாடுகள் பட்டியல்",

    // Headers & selectors
    selectLine: "தயாரிப்பு வரிசை",
    selectStyle: "ஸ்டைல் / டெக் பேக்",
    inspector: "QC ஆய்வாளர்",
    shift: "ஷிப்ட்",
    liveStatus: "நேரடி ஆய்வு",

    // Daily Counters
    inspectedToday: "இன்றைய மொத்த ஆய்வு",
    goodPieces: "சரியான ஆடைகள் (OK)",
    reworkPieces: "மறுவேலை / குறைபாடு (Rework)",
    passRate: "தேர்ச்சி விகிதம்",
    reworkRate: "மறுவேலை விகிதம்",
    target: "இலக்கு",

    // Tablet QC Action Buttons
    btnOk: "சரி (PASS / OK)",
    btnOkSub: "ஆடை தரம் சரியாக உள்ளது",
    btnDefect: "குறைபாடு (DEFECT / REWORK)",
    btnDefectSub: "படத்தை தொட்டு குறைபாட்டை குறிக்கவும்",
    undoLast: "கடைசி ஆய்வை ரத்து செய்",
    recentInspections: "சமீபத்திய ஆய்வுகள்",

    // Defect Pinpoint Modal / Screen
    defectModalTitle: "டெக் பேக்கில் குறைபாட்டை குறிக்கவும்",
    touchInstruction: "குறைபாடு உள்ள இடத்தை தொட்டு பாயிண்ட் வைக்கவும்",
    viewFront: "முன் பக்கம் (Front)",
    viewBack: "பின் பக்கம் (Back)",
    pinsPlaced: "குறிக்கப்பட்ட இடங்கள்",
    clearPins: "அனைத்தையும் அழி",
    removePin: "பாயிண்ட்டை நீக்கு",

    // Side defect multi-select
    selectDefectsLabel: "குறைபாடுகளை தேர்ந்தெடுக்கவும்",
    searchDefectPlaceholder: "குறைபாட்டை தேடவும் அல்லது புதியதை எழுதவும்...",
    selectedDefects: "தேர்ந்தெடுக்கப்பட்ட குறைபாடுகள்",
    addCustomDefectBtn: "+ புதிய குறைபாடு சேர்க்க",
    customDefectPlaceholder: "புதிய குறைபாட்டின் பெயர்...",
    saveCustomDefect: "பட்டியலில் சேர்",
    selectOperation: "தையல் ஆபரேஷன் (பிரிவு)",
    defectSeverity: "தீவிரம்",
    notesPlaceholder: "குறிப்புகள் (தேவையெனில்)...",
    btnSendToRework: "உறுதி செய்து மறுவேலைக்கு அனுப்பு",
    cancel: "ரத்து செய்",

    // TV Dashboard
    tvTitle: "தொழிற்சாலை நேரடி டிவி திரை (LIVE QC)",
    tvTotalChecked: "மொத்த ஆய்வு",
    tvGarmentHeatmap: "ஆடை குறைபாடு வெப்ப வரைபடம் (Heat Map)",
    tvTopOperations: "அதிக குறைபாடு உள்ள ஆபரேஷன்கள்",
    tvDefectPie: "குறைபாடு வகைகள் சதவீத வரைபடம்",
    tvDefectPareto: "குறைபாடு வகை விவரம்",
    tvHourlyRate: "மணிநேர தயாரிப்பு & தர நிலை",
    tvLastUpdated: "ஒவ்வொரு 5 வினாடியும் புதுப்பிக்கப்படுகிறது",
    tvFullscreen: "முழுத்திரை டிவி பயன்முறை",

    // Analytics Page
    analyticsTitle: "நாள் இறுதி QC அறிக்கை & சதவீத வரைபடம்",
    filterDate: "தேதி",
    filterLine: "தயாரிப்பு வரிசை",
    filterStyle: "ஸ்டைல் / PO",
    exportData: "CSV ஏற்றுமதி",
    pieChartTitle: "குறைபாடு வகை சதவீத பை சார்ட் (Pie Chart)",
    pieChartSub: "அனைத்து மற்றும் புதிதாக சேர்க்கப்பட்ட குறைபாடுகள் உட்பட",
    operationsChartTitle: "ஆபரேஷன் வாரியாக குறைபாடுகள்",
    rank: "வரிசை",
    defectType: "குறைபாடு பெயர்",
    occurrences: "ஆடைகள் எண்ணிக்கை",
    percentage: "சதவீதம் %",
    category: "வகை",
    allLines: "அனைத்து லைன்கள்",
    allStyles: "அனைத்து ஸ்டைல்கள்",
    today: "இன்று",
    yesterday: "நேற்று",

    // Defect Master
    masterTitle: "குறைபாடுகள் முதன்மை பட்டியல்",
    masterSub: "நிலையான மற்றும் மனிதரால் சேர்க்கப்பட்ட குறைபாடுகள்",
    addDefect: "புதிய குறைபாடு உருவாக்கு",
    code: "குறியீடு",
    status: "நிலை",
    active: "செயலில்",
    customDefectTag: "கைமுறை பதிவு",

    // Alerts & Notifications
    piecePassSuccess: "ஆடை #{{id}} தேர்ச்சி (OK) என பதிவு செய்யப்பட்டது",
    pieceDefectSuccess: "ஆடை மறுவேலைக்கு (REWORK) அனுப்பப்பட்டது ({{count}} இடங்கள்)",
    customDefectCreated: "புதிய குறைபாடு வெற்றிகரமாக சேர்க்கப்பட்டது!",
    undoSuccess: "கடைசி ஆய்வு மீட்டமைக்கப்பட்டது",
  },

  hi: {
    appTitle: "गारमेंट एंड-लाइन क्यूसी (QC)",
    subtitle: "वस्त्र निर्यात गुणवत्ता निरीक्षण प्रणाली",

    // Navigation
    navQC: "क्यूसी निरीक्षण (टैबलेट)",
    navTV: "टीवी डैशबोर्ड",
    navAnalytics: "दैनिक एनालिटिक्स",
    navTechPacks: "टेक पैक",
    navDefects: "दोष मास्टर सूची",

    // Headers & selectors
    selectLine: "लाइन चुनें",
    selectStyle: "टेक पैक / स्टाइल चुनें",
    inspector: "क्यूसी इंस्पेक्टर",
    shift: "शिफ्ट",
    liveStatus: "लाइव एंड-लाइन",

    // Daily Counters
    inspectedToday: "आज का कुल निरीक्षण",
    goodPieces: "सही पीस (OK)",
    reworkPieces: "रीवर्क / डिफेक्ट पीस",
    passRate: "पास दर %",
    reworkRate: "रीवर्क दर %",
    target: "लक्ष्य",

    // Tablet QC Action Buttons
    btnOk: "पास (OK)",
    btnOkSub: "पीस खरीदार की गुणवत्ता के अनुसार सही है",
    btnDefect: "डिफेक्ट (REWORK)",
    btnDefectSub: "टेक पैक चित्र पर छूकर दोष चिह्नित करें",
    undoLast: "पिछला चेक रद्द करें",
    recentInspections: "हाल के निरीक्षण",

    // Defect Pinpoint Modal / Screen
    defectModalTitle: "टेक पैक पर दोष का स्थान चिह्नित करें",
    touchInstruction: "दोष का स्थान चुनने के लिए कपड़े के चित्र पर स्पर्श करें",
    viewFront: "सामने का दृश्य (Front)",
    viewBack: "पीछे का दृश्य (Back)",
    pinsPlaced: "चिह्नित स्थान",
    clearPins: "सभी पिन हटाएं",
    removePin: "पिन हटाएं",

    // Side defect multi-select
    selectDefectsLabel: "दोषों का चयन करें (मल्टी-सेलेक्ट)",
    searchDefectPlaceholder: "दोष खोजें या नया लिखें...",
    selectedDefects: "चयनित दोष",
    addCustomDefectBtn: "+ नया दोष प्रकार जोड़ें",
    customDefectPlaceholder: "नए दोष का नाम लिखें...",
    saveCustomDefect: "सूची में जोड़ें",
    selectOperation: "सिलाई ऑपरेशन (प्रक्रिया)",
    defectSeverity: "गंभीरता",
    notesPlaceholder: "टिप्पणी (वैकल्पिक)...",
    btnSendToRework: "पुष्टि करें और रीवर्क में भेजें",
    cancel: "रद्द करें",

    // TV Dashboard
    tvTitle: "शॉप-फ्लोर लाइव टीवी डैशबोर्ड (QC)",
    tvTotalChecked: "कुल जाँच",
    tvGarmentHeatmap: "कपड़ा दोष हीट मैप (Heat Map)",
    tvTopOperations: "सर्वाधिक दोष वाले सिलाई ऑपरेशन",
    tvDefectPie: "दोष प्रकार का प्रतिशत पाई चार्ट",
    tvDefectPareto: "दोष प्रकार विवरण",
    tvHourlyRate: "प्रति घंटा उत्पादन और गुणवत्ता",
    tvLastUpdated: "हर 5 सेकंड में स्वतः अपडेट",
    tvFullscreen: "फुलस्क्रीन टीवी मोड",

    // Analytics Page
    analyticsTitle: "दिन का अंत क्यूसी सारांश और दोष विश्लेषण",
    filterDate: "तारीख",
    filterLine: "सिलाई लाइन",
    filterStyle: "स्टाइल / पीओ",
    exportData: "सीएसवी निर्यात",
    pieChartTitle: "दोष प्रकार प्रतिशत पाई चार्ट (Pie Chart)",
    pieChartSub: "मानक और मैन्युअल रूप से जोड़े गए सभी दोष शामिल हैं",
    operationsChartTitle: "सिलाई ऑपरेशन के अनुसार दोष",
    rank: "स्थान",
    defectType: "दोष का नाम",
    occurrences: "पीस संख्या",
    percentage: "प्रतिशत %",
    category: "श्रेणी",
    allLines: "सभी लाइनें",
    allStyles: "सभी स्टाइल",
    today: "आज",
    yesterday: "कल",

    // Defect Master
    masterTitle: "दोष प्रकार मास्टर लाइब्रेरी",
    masterSub: "मानक एवं उपयोगकर्ता द्वारा जोड़े गए दोष",
    addDefect: "नया दोष प्रकार बनाएं",
    code: "कोड",
    status: "स्थिति",
    active: "सक्रिय",
    customDefectTag: "मैन्युअल प्रविष्टि",

    // Alerts & Notifications
    piecePassSuccess: "पीस #{{id}} पास (OK) दर्ज किया गया",
    pieceDefectSuccess: "पीस रीवर्क (REWORK) में भेजा गया ({{count}} पिन)",
    customDefectCreated: "नया दोष सफलतापूर्वक जोड़ा गया!",
    undoSuccess: "पिछला चेक सफलतापूर्वक पूर्ववत किया गया",
  },

  or: {
    appTitle: "ଗାର୍ମେଣ୍ଟ୍ ଏଣ୍ଡ-ଲାଇନ୍ କ୍ୟୁସି (QC)",
    subtitle: "ପୋଷାକ ରପ୍ତାନି ଗୁଣବତ୍ତା ଯାଞ୍ଚ ପ୍ରଣାଳୀ",

    // Navigation
    navQC: "କ୍ୟୁସି ଯାଞ୍ଚ (ଟ୍ୟାବଲେଟ୍)",
    navTV: "ଟିଭି ଡ୍ୟାସବୋର୍ଡ",
    navAnalytics: "ଦୈନିକ ବିଶ୍ଳେଷଣ",
    navTechPacks: "ଟେକ୍ ପ୍ୟାକ୍ (Tech Pack)",
    navDefects: "ତ୍ରୁଟି ତାଲିକା (Defects)",

    // Headers & selectors
    selectLine: "ଲାଇନ୍ ଚୟନ କରନ୍ତୁ",
    selectStyle: "ଷ୍ଟାଇଲ୍ / ଟେକ୍ ପ୍ୟାକ୍",
    inspector: "କ୍ୟୁସି ଇନ୍ସପେକ୍ଟର",
    shift: "ପାଳି (ସିଫ୍ଟ)",
    liveStatus: "ଲାଇଭ୍ ଯାଞ୍ଚ",

    // Daily Counters
    inspectedToday: "ଆଜିର ମୋଟ ଯାଞ୍ଚ",
    goodPieces: "ଠିକ୍ ଖଣ୍ଡ (OK)",
    reworkPieces: "ତ୍ରୁଟି / ରିୱାର୍କ (Rework)",
    passRate: "ପାସ୍ ହାର %",
    reworkRate: "ରିୱାର୍କ ହାର %",
    target: "ଲକ୍ଷ୍ୟ",

    // Tablet QC Action Buttons
    btnOk: "ଠିକ୍ (PASS / OK)",
    btnOkSub: "ଗୁଣବତ୍ତା ଅନୁଯାୟୀ କପଡ଼ା ଠିକ୍ ଅଛି",
    btnDefect: "ତ୍ରୁଟି (DEFECT / REWORK)",
    btnDefectSub: "ଟେକ୍ ପ୍ୟାକ୍ ଛବିରେ ସ୍ପର୍ଶ କରି ସ୍ଥାନ ଚିହ୍ନଟ କରନ୍ତୁ",
    undoLast: "ପୂର୍ବ ଯାଞ୍ଚ ବାତିଲ କରନ୍ତୁ",
    recentInspections: "ନିକଟତମ ଯାଞ୍ଚ",

    // Defect Pinpoint Modal / Screen
    defectModalTitle: "ଟେକ୍ ପ୍ୟାକ୍ରେ ତ୍ରୁଟିର ସ୍ଥାନ ଚିହ୍ନଟ କରନ୍ତୁ",
    touchInstruction: "ତ୍ରୁଟି ଥିବା ସ୍ଥାନ ଚୟନ କରିବାକୁ ଛବିରେ ସ୍ପର୍ଶ କରନ୍ତୁ",
    viewFront: "ଆଗ ପାଖ (Front)",
    viewBack: "ପଛ ପାଖ (Back)",
    pinsPlaced: "ଚିହ୍ନଟ ସ୍ଥାନଗୁଡିକ",
    clearPins: "ସବୁ ପିନ୍ ହଟାନ୍ତୁ",
    removePin: "ପିନ୍ ହଟାନ୍ତୁ",

    // Side defect multi-select
    selectDefectsLabel: "ତ୍ରୁଟିଗୁଡ଼ିକ ଚୟନ କରନ୍ତୁ (ମଲ୍ଟି-ସିଲେକ୍ଟ)",
    searchDefectPlaceholder: "ତ୍ରୁଟି ଖୋଜନ୍ତୁ ବା ନୂଆ ଲେଖନ୍ତୁ...",
    selectedDefects: "ଚୟନିତ ତ୍ରୁଟି",
    addCustomDefectBtn: "+ ନୂଆ ତ୍ରୁଟି ପ୍ରକାର ଯୋଡ଼ନ୍ତୁ",
    customDefectPlaceholder: "ନୂଆ ତ୍ରୁଟିର ନାମ ଲେଖନ୍ତୁ...",
    saveCustomDefect: "ତାଲିକାରେ ଯୋଡ଼ନ୍ତୁ",
    selectOperation: "ସିଲେଇ ଅପରେସନ୍",
    defectSeverity: "ତୀବ୍ରତା",
    notesPlaceholder: "ମନ୍ତବ୍ୟ (ଇଚ୍ଛାଧୀନ)...",
    btnSendToRework: "ନିଶ୍ଚିତ କରନ୍ତୁ ଓ ରିୱାର୍କକୁ ପଠାନ୍ତୁ",
    cancel: "ବାତିଲ୍",

    // TV Dashboard
    tvTitle: "ଫ୍ୟାକ୍ଟ୍ରି ଲାଇଭ୍ ଟିଭି ଡ୍ୟାସବୋର୍ଡ (LIVE QC)",
    tvTotalChecked: "ମୋଟ ଯାଞ୍ଚ",
    tvGarmentHeatmap: "ପୋଷାକ ତ୍ରୁଟି ହିଟ୍ ମ୍ୟାପ୍ (Heat Map)",
    tvTopOperations: "ସର୍ବାଧିକ ତ୍ରୁଟି ଥିବା ଅପରେସନ୍",
    tvDefectPie: "ତ୍ରୁଟି ପ୍ରକାର ପ୍ରତିଶତ ପାଇ ଚାର୍ଟ",
    tvDefectPareto: "ତ୍ରୁଟି ପ୍ରକାର ବିବରଣୀ",
    tvHourlyRate: "ଘଣ୍ଟା ଅନୁସାରେ ଉତ୍ପାଦନ ଓ ଗୁଣବତ୍ତା",
    tvLastUpdated: "ପ୍ରତି ୫ ସେକେଣ୍ଡରେ ଅପଡେଟ୍ ହେଉଛି",
    tvFullscreen: "ଫୁଲ୍ ସ୍କ୍ରିନ୍ ଟିଭି ମୋଡ୍",

    // Analytics Page
    analyticsTitle: "ଦିନ ଶେଷ କ୍ୟୁସି ବିବରଣୀ ଓ ବିଶ୍ଳେଷଣ",
    filterDate: "ତାରିଖ",
    filterLine: "ଉତ୍ପାଦନ ଲାଇନ୍",
    filterStyle: "ଷ୍ଟାଇଲ୍ / ପିଓ",
    exportData: "ସିଏସଭି (CSV) ଏକ୍ସପୋର୍ଟ",
    pieChartTitle: "ତ୍ରୁଟି ପ୍ରକାର ପ୍ରତିଶତ ପାଇ ଚାର୍ଟ (Pie Chart)",
    pieChartSub: "ମାନକ ଏବଂ ନିଜେ ଯୋଡ଼ାଯାଇଥିବା ସମସ୍ତ ତ୍ରୁଟି ଅନ୍ତର୍ଭୁକ୍ତ",
    operationsChartTitle: "ଅପରେସନ୍ ଅନୁସାରେ ତ୍ରୁଟି ସଂଖ୍ୟା",
    rank: "କ୍ରମ",
    defectType: "ତ୍ରୁଟିର ନାମ",
    occurrences: "ପିସ୍ ସଂଖ୍ୟା",
    percentage: "ପ୍ରତିଶତ %",
    category: "ବର୍ଗ",
    allLines: "ସମସ୍ତ ଲାଇନ୍",
    allStyles: "ସମସ୍ତ ଷ୍ଟାଇଲ୍",
    today: "ଆଜି",
    yesterday: "ଗତକାଲି",

    // Defect Master
    masterTitle: "ତ୍ରୁଟି ପ୍ରକାର ମାଷ୍ଟର ଲାଇବ୍ରେରୀ",
    masterSub: "ମାନକ ଏବଂ ହାତରେ ଯୋଡ଼ାଯାଇଥିବା ତ୍ରୁଟି ସମୂହ",
    addDefect: "ନୂଆ ତ୍ରୁଟି ତିଆରି କରନ୍ତୁ",
    code: "କୋଡ୍",
    status: "ସ୍ଥିତି",
    active: "ସକ୍ରିୟ",
    customDefectTag: "ନିଜେ ଯୋଡ଼ିଥିବା",

    // Alerts & Notifications
    piecePassSuccess: "ପିସ୍ #{{id}} ପାସ୍ (OK) ଭାବେ ଦାଖଲ ହେଲା",
    pieceDefectSuccess: "ପିସ୍ ରିୱାର୍କ (REWORK) କୁ ପଠାଗଲା ({{count}} ସ୍ଥାନ)",
    customDefectCreated: "ନୂଆ ତ୍ରୁଟି ସଫଳତାର ସହ ଯୋଡ଼ାଗଲା!",
    undoSuccess: "ପୂର୍ବ ଯାଞ୍ଚ ସଫଳତାର ସହ ଫେରସ୍ତ କରାଗଲା",
  },
};

export const languages = [
  { code: "en", label: "English", native: "English", flag: "🇬🇧" },
  { code: "ta", label: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
  { code: "hi", label: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ", flag: "🇮🇳" },
];

