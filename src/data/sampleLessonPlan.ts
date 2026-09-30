import type { LessonPlanData } from '../types/lessonPlan';

export const sampleLessonPlan: LessonPlanData = {
  metadata: {
    academicYear: '2026/2027',
    subject: 'Chemistry',
    teacherName: 'Salman Madani, S.Pd.',
    gradeSemester: 'Grade 10 / Semester 1',
    topicOfDiscussion: 'Ionic and Covalent Bonding',
    periodWeek: 'Week 4',
    chapterSubChapter: 'Chapter 3: Chemical Bonding & Structure',
    principalName: 'Chabib Mustofa S.Pd.I, M.Pd',
    curriculumVpName: 'Nur Intan Kumalasari M.Pd',
    locationDate: 'South Tangerang, September 30, 2026',
  },
  learningOutcomesCP:
    'Students understand the formation of ionic and covalent bonds, relate bonding types to physical properties of substances (melting point, electrical conductivity, solubility), and demonstrate appreciation of order and atomic harmony as reflections of divine creation.',
  learningObjectivesTP:
    '1. FC1: Remember + Factual & CC2: Understand + Conceptual - Describe the formation of ionic bonds through electron transfer.\n2. PC3: Apply + Procedural - Construct dot-and-cross diagrams illustrating shared electron pairs in covalent molecules.\n3. CC4: Analyze + Conceptual & PC5: Evaluate + Procedural - Compare physical properties of ionic vs covalent compounds based on electrostatic lattice attractions versus intermolecular forces.',
  sessions: [
    {
      sessionNumber: 1,
      sessionTitle: 'Ionic Bonding & Electron Transfer',
      durationText: '2 x 40 Minutes',
      totalMinutes: 80,
      microLearningObjectives:
        'FC1: Remember + Factual - Recall typical charges of Group I, II, VI, and VII ions and state the octet rule.\nCC2: Understand + Conceptual - Explain how cations and anions form via electron transfer to achieve a noble gas configuration, producing strong electrostatic lattice attractions.',
      icmIndicators: {
        faithful: false,
        adabAkhlaq: false,
        independence: true,
        intelligence: true,
        leadership: false,
        explanation:
          'At minute 35 during the ionic bonding modeling activity, teacher fosters student autonomy (Independence) and scientific reasoning (Intelligence): students independently deduce the empirical formula of binary compounds using element tiles, articulating the chemical logic of electron transfer.',
      },
      sequenceOfTeaching: {
        exposure: true,
        miniLesson: true,
        groupPractice: true,
        independentPractice: false,
        assessment: true,
        details: 'Visual demo -> Concept explanation -> Pair drawing -> Quick exit ticket check.',
      },
      differentiation: {
        content: true,
        process: true,
        product: false,
        readinessInterestProfile: true,
        explanation:
          'Tiered scaffolding: Foundation learners receive element cutout cards with physical valence electrons to physically move; advanced learners predict formulas for transition metal polyatomic salts (e.g. Fe2(SO4)3).',
      },
      vocabulary:
        'Ion — an atom or molecule carrying a net electrical charge; Cation — a positively charged ion formed by electron loss (e.g. Na⁺); Anion — a negatively charged ion formed by electron gain (e.g. Cl⁻); Electrostatic Attraction — non-directional coulombic attraction binding oppositely charged ions; Lattice — regular repeating 3D ionic framework; Valence Electrons — outer shell electrons involved in bonding; Octet Rule — tendency of atoms to bond to achieve 8 valence electrons.',
      essentialQuestion:
        'How does an atom’s quest for electronic stability drive the formation of everyday compounds like table salt?',
      contextTriggerQuestion:
        'Why does sodium (a violent metal) combined with chlorine (a toxic gas) create table salt that is essential for human life?',
      planActivities: {
        beginning: {
          timingMinutes: 15,
          description:
            'Teacher shows a 60-second video of sodium reacting with chlorine gas, then presents table salt crystals under a digital visualizer. Teacher asks the Context Trigger Question. Students Turn-and-Talk for 2 minutes and share hypotheses. Teacher introduces the two Micro LOs on the board.',
          resources: 'Na + Cl2 reaction video clip, rock salt samples, digital visualizer, presentation slides.',
        },
        middle: {
          timingMinutes: 50,
          description:
            '[Minutes 16-30] Teacher demonstrates electron transfer for NaCl and MgO using magnetic Bohr discs on the board, emphasizing electron loss vs gain. Teacher checks understanding using mini-whiteboards: "Show the Lewis symbol for a sulfide ion with brackets and charge." [Minutes 31-45] Students work in pairs with element tile cards to model electron transfers for 4 progressive binary compounds: LiF, CaO, MgCl2, and Al2O3. Teacher circulates targeting pairs struggling with 1:2 stoichiometry. [Minutes 46-50] Teacher consolidates why calcium requires two chloride ions.',
          resources: 'Magnetic Bohr atom boards, element cutouts, student guided practice worksheets (WS 3.1), mini-whiteboards.',
        },
        end: {
          timingMinutes: 15,
          description:
            'Students independently complete a silent Formative Exit Ticket slip. Teacher facilitates a 2-minute synthesis on student autonomy (Independence) and atomic stability (Intelligence), and collects slips to assess readiness for covalent bonding.',
          resources: 'Formative Exit Ticket slips 3.1, collection tray.',
        },
      },
      reflectionEvaluation:
        'Anticipate that 20-25% of students will confuse subscript numbers with ionic charges (e.g., writing MgCl2 instead of recognizing Mg²⁺ and two Cl⁻ ions). Checkpoint: Inspect whiteboard responses at minute 28. Contingency: Pair struggling students with peer coaches and provide pre-printed Bohr scaffold frames; provide ternary polyatomic extension problems for fast finishers.',
      nextPlanFollowUp:
        'Review MgCl2 and Al2O3 dot-and-cross representation in a 4-minute opening warm-up during Session 2 before introducing electron sharing in covalent molecules.',
      plannedAssessment:
        'Formative: Exit Ticket slip with 2 items. Item 1 (Measures FC1): State the ion symbol and charge for Potassium (Group I) and Oxygen (Group VI). Item 2 (Measures CC2): Draw the electron transfer diagram for Magnesium Chloride (MgCl2) showing outer shells and resulting bracketed ions with charges. Success criteria: Full credit (4 pts) requires correct ion charges (+2, -1) and two Cl ions clearly receiving one electron each from Mg; Partial credit (2 pts) if charges are correct but electron movement arrows are omitted.',
    },
    {
      sessionNumber: 2,
      sessionTitle: 'Covalent Bonding & Dot-and-Cross Diagrams',
      durationText: '2 x 40 Minutes',
      totalMinutes: 80,
      microLearningObjectives:
        'CC2: Understand + Conceptual - Describe covalent bonding as the sharing of pairs of electrons between non-metal atoms leading to noble gas configurations.\nPC3: Apply + Procedural - Construct accurate dot-and-cross diagrams representing single, double, and triple covalent bonds (H2, Cl2, O2, N2, H2O, CH4, CO2).',
      icmIndicators: {
        faithful: false,
        adabAkhlaq: false,
        independence: true,
        intelligence: true,
        leadership: true,
        explanation:
          'At minute 40 during trio problem solving, teacher highlights peer-coaching leadership (Leadership): students take turns guiding partners through lone pair placement on mini-whiteboards, fostering collaborative accountability alongside independent reasoning (Independence & Intelligence).',
      },
      sequenceOfTeaching: {
        exposure: false,
        miniLesson: true,
        groupPractice: true,
        independentPractice: true,
        assessment: true,
        details: 'Mini-lesson on sharing vs transfer -> Trio workshop -> Individual practice.',
      },
      differentiation: {
        content: false,
        process: false,
        product: false,
        readinessInterestProfile: false,
        explanation: 'N/A for this session (focusing on collaborative peer-tutoring protocol).',
      },
      vocabulary:
        'Covalent Bond — electrostatic attraction between a shared pair of electrons and the positively charged nuclei; Shared Pair — pair of electrons in an overlap region shared by two atoms; Lone Pair — non-bonding valence electron pair localized on an atom; Diatomic Molecule — a molecule composed of only two atoms (e.g. O2, N2); Electronegativity — ability of an atom to attract bonding electrons toward itself.',
      essentialQuestion:
        'When atoms cannot give or take electrons easily, how do they cooperate to achieve stability?',
      contextTriggerQuestion:
        'Why does water (H2O) stay as a liquid at room temperature while hydrogen and oxygen are explosive gases?',
      planActivities: {
        beginning: {
          timingMinutes: 15,
          description:
            'Bridge warm-up: 4-minute mini-whiteboard check on Session 1 MgCl2 formula misconception. Teacher poses the trigger question comparing the nature of H2, O2, and H2O. Concept of "electron sharing" introduced using an overlap Venn diagram analogy.',
          resources: 'Mini whiteboards, dry-erase markers, slide presentation.',
        },
        middle: {
          timingMinutes: 50,
          description:
            'Teacher models dot-and-cross construction for H2, Cl2, and O2 on the interactive screen, distinguishing shared pairs from lone pairs. Students work in trios using color-coded dry erase markers to solve progressively challenging structures: H2O, NH3, CH4, and CO2. Teacher facilitates peer review rounds and spot-checks double/triple bonds in O2 and N2.',
          resources: 'Color-coded whiteboard markers, molecular modeling kit, Worksheet 3.2.',
        },
        end: {
          timingMinutes: 15,
          description:
            'Pairs swap whiteboards for peer verification with standard answer key rubrics. Teacher wraps up by linking covalent bonds to molecular compounds in living systems.',
          resources: 'Peer assessment rubric cards.',
        },
      },
      reflectionEvaluation:
        'Anticipate confusion between bonding electrons and lone pairs, especially on central atoms in H2O and NH3. Checkpoint: Inspect trio whiteboards at minute 35 when constructing O2 double bonds. Contingency: Have molecular ball-and-stick models on standby for visual tactile learners; introduce coordinate covalent bonds (NH4⁺) as an extension for fast finishers.',
      nextPlanFollowUp:
        'Prepare testing apparatus for conductivity and melting points for Session 3.',
      plannedAssessment:
        'Formative: Individual diagram challenge problem for Carbon Dioxide (CO2). Measures PC3 (Apply + Procedural). Success criteria: Full marks (3 pts) requires two double bonds (4 shared pairs total) and two lone pairs on each oxygen atom; Partial (1-2 pts) if single bonds are drawn or lone pairs are omitted.',
    },
    {
      sessionNumber: 3,
      sessionTitle: 'Physical Properties: Ionic vs Covalent Compounds',
      durationText: '2 x 40 Minutes',
      totalMinutes: 80,
      microLearningObjectives:
        'CC4: Analyze + Conceptual - Compare and contrast the physical properties of ionic substances (high melting points, conductive when molten/aqueous) versus simple covalent substances (low melting points, electrical insulators) in terms of structure and intermolecular forces.\nPC5: Evaluate + Procedural - Evaluate laboratory observations and conductivity data to classify unknown chemical substances into ionic or covalent categories.',
      icmIndicators: {
        faithful: false,
        adabAkhlaq: false,
        independence: true,
        intelligence: true,
        leadership: false,
        explanation:
          'At the conclusion of the conductivity lab, students demonstrate rigorous empirical analysis (Intelligence) and autonomous investigation (Independence) by interpreting experimental data to classify unknown chemical substances.',
      },
      sequenceOfTeaching: {
        exposure: true,
        miniLesson: true,
        groupPractice: true,
        independentPractice: false,
        assessment: true,
        details: 'Lab demonstration -> Student hands-on testing -> Comparison matrix -> Evaluative exit task.',
      },
      differentiation: {
        content: false,
        process: true,
        product: false,
        readinessInterestProfile: true,
        explanation:
          'Scaffolded analysis matrix provided with guiding hint prompts for students requiring literacy or conceptual assistance; advanced students evaluate anomalies like graphite.',
      },
      vocabulary:
        'Conductivity — ability of a material to conduct electric charge via mobile ions or electrons; Lattice Energy — energy required to completely separate one mole of a solid ionic compound into gaseous ions; Intermolecular Forces — weak attractions between covalent molecules; Volatility — tendency of a substance to vaporize; Electrolyte — substance that produces an electrically conducting solution when dissolved in water.',
      essentialQuestion:
        'How does microscopic bonding determine whether a material dissolves, conducts electricity, or melts easily?',
      contextTriggerQuestion:
        'Why does salt water conduct electricity to power a buzzer, while sugar water leaves the buzzer silent?',
      planActivities: {
        beginning: {
          timingMinutes: 15,
          description:
            'Live micro-lab demo: Teacher tests electrical conductivity of dry salt, salt solution, dry sugar, and sugar solution using an LED buzzer circuit. Teacher asks trigger question. Students hypothesize in pairs.',
          resources: 'Conductivity testing kit (9V battery, LED, buzzer, electrodes, beaker with NaCl(aq) and sucrose(aq)).',
        },
        middle: {
          timingMinutes: 50,
          description:
            'Students conduct mini-lab in pairs testing solubility and melting points of wax, sugar, and salt over hot water baths and micro-burners. They record findings in an interactive Comparison Matrix, correlating mobile ions with conductivity and intermolecular forces with volatility.',
          resources: 'Comparative analysis worksheet 3.3, micro-test tubes, heating bath, reference cards.',
        },
        end: {
          timingMinutes: 15,
          description:
            'Class synthesis and 10-minute evaluative prompt connecting microscopic bonding to macroscopic function. Submission of weekly workbook.',
          resources: 'Formative Assessment Exit Card 3.3.',
        },
      },
      reflectionEvaluation:
        'Anticipate student tendency to claim solid salt conducts electricity because it has ions. Checkpoint: Ask cold-call question at minute 20: "Why must ions be molten or in solution to conduct?" Contingency: Use animation showing immobilized ions in solid lattice vs freely moving hydrated ions.',
      nextPlanFollowUp:
        'Next week: Metallic bonding and giant covalent structures (diamond, graphite, silicon dioxide).',
      plannedAssessment:
        'Formative/Diagnostic: 5-minute comparison table task. Question: Explain why NaCl melts at 801°C and conducts in aqueous solution, whereas C12H22O11 (sucrose) melts at 186°C and is non-conductive. Measures CC4 (Analyze + Conceptual) & PC5 (Evaluate + Procedural). Success criteria: Full marks (4 pts) correctly cites strong electrostatic lattice attractions requiring high energy vs weak intermolecular forces in sugar, and presence of free-moving hydrated ions in NaCl(aq) vs neutral molecules in sugar solution.',
    },
  ],
};
