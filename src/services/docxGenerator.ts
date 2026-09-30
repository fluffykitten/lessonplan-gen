import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
  ImageRun,
  LineRuleType,
} from 'docx';
import { saveAs } from 'file-saver';
import type { LessonPlanData, LessonSession } from '../types/lessonPlan';
import { createIcmLogoPng, createCambridgeLogoPng } from '../assets/logos';

// Convert base64 data url to Uint8Array for docx ImageRun
function dataUriToUint8Array(dataUri: string): Uint8Array {
  const base64 = dataUri.split(',')[1];
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Styling Constants
let FONT_FAMILY = 'Arial';
let FONT_SIZE_DELTA = 0;
let LINE_SPACING_TWIPS = 360; // default 1.5 line spacing (240 * 1.5)
let PARA_SPACING_RATIO = 1.0; // default 1.5 / 1.5

function sz(baseSize: number): number {
  return Math.max(14, baseSize + FONT_SIZE_DELTA);
}

function sp(before: number = 0, after: number = 0) {
  return {
    line: LINE_SPACING_TWIPS,
    lineRule: LineRuleType.AUTO,
    before: Math.round(before * PARA_SPACING_RATIO),
    after: Math.round(after * PARA_SPACING_RATIO),
  };
}

const COLOR_GRAY_HEADER = 'D9D9D9';
const BORDER_COLOR = '555555';

const thinBorder = {
  style: BorderStyle.SINGLE,
  size: 4, // 0.5 pt
  color: BORDER_COLOR,
};

const tableBorders = {
  top: thinBorder,
  bottom: thinBorder,
  left: thinBorder,
  right: thinBorder,
  insideHorizontal: thinBorder,
  insideVertical: thinBorder,
};

const noBorder = {
  style: BorderStyle.NONE,
  size: 0,
  color: 'FFFFFF',
};

const borderlessTable = {
  top: noBorder,
  bottom: noBorder,
  left: noBorder,
  right: noBorder,
  insideHorizontal: noBorder,
  insideVertical: noBorder,
};

export async function exportLessonPlanToDocx(
  plan: LessonPlanData,
  customIcmLogo?: string,
  customCambridgeLogo?: string,
  customFontFamily: string = 'Arial',
  customFontSizePt: number = 11,
  customLineSpacing: number = 1.5,
  customParagraphSpacing: number = 1.5
): Promise<void> {
  FONT_FAMILY = customFontFamily || 'Arial';
  FONT_SIZE_DELTA = (customFontSizePt - 11) * 2;
  LINE_SPACING_TWIPS = Math.round((customLineSpacing || 1.5) * 240);
  PARA_SPACING_RATIO = (customParagraphSpacing || 1.5) / 1.5;
  const icmDataUri = customIcmLogo || createIcmLogoPng();
  const cambridgeDataUri = customCambridgeLogo || createCambridgeLogoPng();

  let icmImgRun: ImageRun | null = null;
  let cambridgeImgRun: ImageRun | null = null;

  try {
    if (icmDataUri) {
      icmImgRun = new ImageRun({
        data: dataUriToUint8Array(icmDataUri),
        transformation: { width: 160, height: 48 },
        type: 'png',
      });
    }
  } catch (e) {
    console.warn('Could not render ICM logo in docx', e);
  }

  try {
    if (cambridgeDataUri) {
      cambridgeImgRun = new ImageRun({
        data: dataUriToUint8Array(cambridgeDataUri),
        transformation: { width: 175, height: 46 },
        type: 'png',
      });
    }
  } catch (e) {
    console.warn('Could not render Cambridge logo in docx', e);
  }

  // Header Table with Logos and Academic Year
  const headerLogoRow = new TableRow({
    children: [
      new TableCell({
        width: { size: 5000, type: WidthType.DXA },
        children: [
          new Paragraph({
            children: icmImgRun ? [icmImgRun] : [new TextRun({ text: 'ICM INSAN CENDEKIA MADANI', bold: true })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 4500, type: WidthType.DXA },
        children: [
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: cambridgeImgRun
              ? [cambridgeImgRun]
              : [new TextRun({ text: 'Cambridge Assessment International Education', bold: true })],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: sp(40, 40),
            children: [
              new TextRun({
                text: `Academic Year: ${plan.metadata.academicYear || '2026/2027'}`,
                italics: true,
                bold: true,
                font: FONT_FAMILY,
                size: sz(20), // 10pt
              }),
            ],
          }),
        ],
      }),
    ],
  });

  const headerTable = new Table({
    width: { size: 9500, type: WidthType.DXA },
    borders: borderlessTable,
    rows: [headerLogoRow],
  });

  // Main School Title
  const titleParagraph = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: sp(40, 40),
    children: [
      new TextRun({
        text: 'INSAN CENDEKIA MADANI HIGH SCHOOL PROGRAM LESSON PLANNING',
        bold: true,
        font: FONT_FAMILY,
        size: sz(24), // 12pt
      }),
    ],
  });

  // Metadata Table (Subject, Teacher, Grade, etc.)
  const createMetaRow = (label: string, value: string) =>
    new TableRow({
      children: [
        new TableCell({
          width: { size: 3000, type: WidthType.DXA },
          shading: { fill: COLOR_GRAY_HEADER, type: ShadingType.CLEAR },
          children: [
            new Paragraph({
              spacing: sp(40, 40),
              children: [new TextRun({ text: label, bold: true, font: FONT_FAMILY, size: sz(20) })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 6500, type: WidthType.DXA },
          children: [
            new Paragraph({
              spacing: sp(40, 40),
              children: [new TextRun({ text: `: ${value || ''}`, font: FONT_FAMILY, size: sz(20) })],
            }),
          ],
        }),
      ],
    });

  const metadataTable = new Table({
    width: { size: 9500, type: WidthType.DXA },
    borders: tableBorders,
    rows: [
      createMetaRow('Subject', plan.metadata.subject),
      createMetaRow("Teacher's Name", plan.metadata.teacherName),
      createMetaRow('Grade / Semester', plan.metadata.gradeSemester),
      createMetaRow('Topic of Discussion', plan.metadata.topicOfDiscussion),
      createMetaRow('Period / Week', plan.metadata.periodWeek),
      createMetaRow('Chapter / Sub-Chapter', plan.metadata.chapterSubChapter),
    ],
  });

  // Capaian Pembelajaran (CP) & Tujuan Pembelajaran (TP) Table
  const outcomesTable = new Table({
    width: { size: 9500, type: WidthType.DXA },
    borders: tableBorders,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 9500, type: WidthType.DXA },
            shading: { fill: COLOR_GRAY_HEADER, type: ShadingType.CLEAR },
            children: [
              new Paragraph({
                spacing: sp(40, 40),
                children: [
                  new TextRun({
                    text: 'Learning Outcomes (Capaian Pembelajaran / CP)',
                    bold: true,
                    font: FONT_FAMILY,
                    size: sz(20),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 9500, type: WidthType.DXA },
            children: [
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                spacing: sp(40, 40),
                children: [
                  new TextRun({
                    text: plan.learningOutcomesCP || '',
                    font: FONT_FAMILY,
                    size: sz(20),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 9500, type: WidthType.DXA },
            shading: { fill: COLOR_GRAY_HEADER, type: ShadingType.CLEAR },
            children: [
              new Paragraph({
                spacing: sp(40, 40),
                children: [
                  new TextRun({
                    text: 'Learning Objectives (Tujuan Pembelajaran/ TP) – Anderson Kratwohl Taxonomy',
                    bold: true,
                    font: FONT_FAMILY,
                    size: sz(20),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: 9500, type: WidthType.DXA },
            children: plan.learningObjectivesTP
              ? plan.learningObjectivesTP.split('\n').map(
                  (line) =>
                    new Paragraph({
                      alignment: AlignmentType.JUSTIFIED,
                      spacing: sp(40, 40),
                      children: [new TextRun({ text: line, font: FONT_FAMILY, size: sz(20) })],
                    })
                )
              : [
                  new Paragraph({
                    children: [new TextRun({ text: '', font: FONT_FAMILY, size: sz(20) })],
                  }),
                ],
          }),
        ],
      }),
    ],
  });

  // Build each Session Table
  const sessionTables: (Paragraph | Table)[] = [];

  plan.sessions.forEach((session: LessonSession) => {
    // Spacer before session
    sessionTables.push(new Paragraph({ spacing: sp(40, 40) }));

    const chk = (val: boolean) => (val ? '☒' : '☐');

    const sessionTable = new Table({
      width: { size: 9500, type: WidthType.DXA },
      borders: tableBorders,
      rows: [
        // 1. Session Title Banner
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              width: { size: 9500, type: WidthType.DXA },
              shading: { fill: COLOR_GRAY_HEADER, type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  spacing: sp(40, 40),
                  children: [
                    new TextRun({
                      text: `Session ${session.sessionNumber}: ${session.durationText || '2 x 40 Minutes'} : ${session.sessionTitle || ''}`,
                      bold: true,
                      font: FONT_FAMILY,
                      size: sz(20),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),

        // 2. Micro LO Header
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              width: { size: 9500, type: WidthType.DXA },
              shading: { fill: COLOR_GRAY_HEADER, type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  spacing: sp(40, 40),
                  children: [
                    new TextRun({
                      text: 'Learning Objectives (Indicator) / Micro TP',
                      bold: true,
                      font: FONT_FAMILY,
                      size: sz(20),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),

        // 3. Micro LO Content
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              width: { size: 9500, type: WidthType.DXA },
              children: session.microLearningObjectives
                ? session.microLearningObjectives.split('\n').map(
                    (line) =>
                      new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: sp(40, 40),
                        children: [new TextRun({ text: line, font: FONT_FAMILY, size: sz(20) })],
                      })
                  )
                : [new Paragraph({ children: [new TextRun({ text: '' })] })],
            }),
          ],
        }),

        // 4. ICM Indicators Header
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              width: { size: 9500, type: WidthType.DXA },
              shading: { fill: COLOR_GRAY_HEADER, type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  spacing: sp(40, 40),
                  children: [
                    new TextRun({
                      text: 'Insan Cendekia Madani Indicators:',
                      bold: true,
                      font: FONT_FAMILY,
                      size: sz(20),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),

        // 5. ICM Indicators Checklist & Explanation
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              width: { size: 9500, type: WidthType.DXA },
              children: [
                new Paragraph({
                  spacing: sp(40, 40),
                  children: [
                    new TextRun({
                      text: `${chk(session.icmIndicators.faithful)} Faithful   `,
                      font: FONT_FAMILY,
                      size: sz(20),
                    }),
                    new TextRun({
                      text: `${chk(session.icmIndicators.adabAkhlaq)} Adab Akhlaq   `,
                      font: FONT_FAMILY,
                      size: sz(20),
                    }),
                    new TextRun({
                      text: `${chk(session.icmIndicators.independence)} Independence   `,
                      font: FONT_FAMILY,
                      size: sz(20),
                    }),
                    new TextRun({
                      text: `${chk(session.icmIndicators.intelligence)} Intelligence   `,
                      font: FONT_FAMILY,
                      size: sz(20),
                    }),
                    new TextRun({
                      text: `${chk(session.icmIndicators.leadership)} Leadership`,
                      font: FONT_FAMILY,
                      size: sz(20),
                    }),
                  ],
                }),
                new Paragraph({
                  spacing: sp(40, 40),
                  children: [
                    new TextRun({
                      text: 'Explanation: ',
                      bold: true,
                      font: FONT_FAMILY,
                      size: sz(19),
                    }),
                    new TextRun({
                      text: session.icmIndicators.explanation || '',
                      font: FONT_FAMILY,
                      size: sz(19),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),

        // 6. Split Headers: Sequence of Teaching vs Differentiation
        new TableRow({
          children: [
            new TableCell({
              width: { size: 4750, type: WidthType.DXA },
              shading: { fill: COLOR_GRAY_HEADER, type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  spacing: sp(40, 40),
                  children: [
                    new TextRun({
                      text: 'Sequence of Teaching (checklist)',
                      bold: true,
                      font: FONT_FAMILY,
                      size: sz(20),
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 4750, type: WidthType.DXA },
              shading: { fill: COLOR_GRAY_HEADER, type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  spacing: sp(40, 40),
                  children: [
                    new TextRun({
                      text: 'Differentiation (checklist)',
                      bold: true,
                      font: FONT_FAMILY,
                      size: sz(20),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),

        // 7. Split Content: Sequence checklist vs Differentiation checklist
        new TableRow({
          children: [
            new TableCell({
              width: { size: 4750, type: WidthType.DXA },
              children: [
                new Paragraph({
                  spacing: sp(40, 40),
                  children: [
                    new TextRun({
                      text: `${chk(session.sequenceOfTeaching.exposure)} Exposure\n`,
                      font: FONT_FAMILY,
                      size: sz(19),
                    }),
                    new TextRun({
                      text: `${chk(session.sequenceOfTeaching.miniLesson)} Mini lesson (guided practice)\n`,
                      font: FONT_FAMILY,
                      size: sz(19),
                    }),
                    new TextRun({
                      text: `${chk(session.sequenceOfTeaching.groupPractice)} Group practice/Collaborative Workshop\n`,
                      font: FONT_FAMILY,
                      size: sz(19),
                    }),
                    new TextRun({
                      text: `${chk(session.sequenceOfTeaching.independentPractice)} Independent practice\n`,
                      font: FONT_FAMILY,
                      size: sz(19),
                    }),
                    new TextRun({
                      text: `${chk(session.sequenceOfTeaching.assessment)} Formative / Summative assessment`,
                      font: FONT_FAMILY,
                      size: sz(19),
                    }),
                  ],
                }),
                ...(session.sequenceOfTeaching.details
                  ? [
                      new Paragraph({
                        spacing: sp(40, 40),
                        children: [
                          new TextRun({
                            text: `Flow: ${session.sequenceOfTeaching.details}`,
                            italics: true,
                            font: FONT_FAMILY,
                            size: sz(18),
                          }),
                        ],
                      }),
                    ]
                  : []),
              ],
            }),
            new TableCell({
              width: { size: 4750, type: WidthType.DXA },
              children: [
                new Paragraph({
                  spacing: sp(40, 40),
                  children: [
                    new TextRun({
                      text: `${chk(session.differentiation.content)} Content\n`,
                      font: FONT_FAMILY,
                      size: sz(19),
                    }),
                    new TextRun({
                      text: `${chk(session.differentiation.process)} Process\n`,
                      font: FONT_FAMILY,
                      size: sz(19),
                    }),
                    new TextRun({
                      text: `${chk(session.differentiation.product)} Product\n`,
                      font: FONT_FAMILY,
                      size: sz(19),
                    }),
                    new TextRun({
                      text: `${chk(session.differentiation.readinessInterestProfile)} Readiness / Interest / Learning profile`,
                      font: FONT_FAMILY,
                      size: sz(19),
                    }),
                  ],
                }),
                new Paragraph({
                  spacing: sp(40, 40),
                  children: [
                    new TextRun({
                      text: session.differentiation.explanation || 'N/A for this session',
                      font: FONT_FAMILY,
                      size: sz(18),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),

        // 8a. Vocabulary & Essential Question Headers (2-column gray header)
        new TableRow({
          children: [
            new TableCell({
              width: { size: 4750, type: WidthType.DXA },
              shading: { fill: COLOR_GRAY_HEADER, type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  spacing: sp(40, 40),
                  children: [
                    new TextRun({
                      text: 'Vocabulary, Terminology and Phrases:',
                      bold: true,
                      font: FONT_FAMILY,
                      size: sz(20),
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 4750, type: WidthType.DXA },
              shading: { fill: COLOR_GRAY_HEADER, type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  spacing: sp(40, 40),
                  children: [
                    new TextRun({
                      text: 'Essential Question:',
                      bold: true,
                      font: FONT_FAMILY,
                      size: sz(20),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),

        // 8b. Vocabulary & Essential Question Content (2-column content row)
        new TableRow({
          children: [
            new TableCell({
              width: { size: 4750, type: WidthType.DXA },
              children: [
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  spacing: sp(40, 40),
                  children: [
                    new TextRun({
                      text: session.vocabulary || '',
                      font: FONT_FAMILY,
                      size: sz(19),
                    }),
                  ],
                }),
              ],
            }),
            new TableCell({
              width: { size: 4750, type: WidthType.DXA },
              children: [
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  spacing: sp(40, 40),
                  children: [
                    new TextRun({
                      text: session.essentialQuestion || '',
                      font: FONT_FAMILY,
                      size: sz(19),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),

        // 9a. Context & Trigger Question Header (gray header banner)
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              width: { size: 9500, type: WidthType.DXA },
              shading: { fill: COLOR_GRAY_HEADER, type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  spacing: sp(40, 40),
                  children: [
                    new TextRun({
                      text: 'Context & Trigger Question:',
                      bold: true,
                      font: FONT_FAMILY,
                      size: sz(20),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),

        // 9b. Context & Trigger Question Content
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              width: { size: 9500, type: WidthType.DXA },
              children: [
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  spacing: sp(40, 40),
                  children: [
                    new TextRun({
                      text: session.contextTriggerQuestion || '',
                      font: FONT_FAMILY,
                      size: sz(19),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),

        // 10. Plan Activities Header Banner
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              width: { size: 9500, type: WidthType.DXA },
              shading: { fill: COLOR_GRAY_HEADER, type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  spacing: sp(40, 40),
                  children: [new TextRun({ text: 'Plan', bold: true, font: FONT_FAMILY, size: sz(20) })],
                }),
              ],
            }),
          ],
        }),

        // 11. Nested Activities Table Header
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              width: { size: 9500, type: WidthType.DXA },
              children: [
                new Table({
                  width: { size: 9500, type: WidthType.DXA },
                  borders: tableBorders,
                  rows: [
                    new TableRow({
                      children: [
                        new TableCell({
                          width: { size: 1600, type: WidthType.DXA },
                          shading: { fill: COLOR_GRAY_HEADER, type: ShadingType.CLEAR },
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.CENTER,
                              children: [
                                new TextRun({ text: 'Planned Timings', bold: true, font: FONT_FAMILY, size: sz(19) }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          width: { size: 5900, type: WidthType.DXA },
                          shading: { fill: COLOR_GRAY_HEADER, type: ShadingType.CLEAR },
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.CENTER,
                              children: [
                                new TextRun({ text: 'Planning Activity', bold: true, font: FONT_FAMILY, size: sz(19) }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          width: { size: 2000, type: WidthType.DXA },
                          shading: { fill: COLOR_GRAY_HEADER, type: ShadingType.CLEAR },
                          children: [
                            new Paragraph({
                              alignment: AlignmentType.CENTER,
                              children: [
                                new TextRun({ text: 'Resources/ Materials', bold: true, font: FONT_FAMILY, size: sz(19) }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),

                    // Beginning Activity
                    new TableRow({
                      children: [
                        new TableCell({
                          width: { size: 1600, type: WidthType.DXA },
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: `Beginning (${session.planActivities.beginning.timingMinutes || 10}')`,
                                  bold: true,
                                  font: FONT_FAMILY,
                                  size: sz(19),
                                }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          width: { size: 5900, type: WidthType.DXA },
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: session.planActivities.beginning.description || '',
                                  font: FONT_FAMILY,
                                  size: sz(19),
                                }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          width: { size: 2000, type: WidthType.DXA },
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: session.planActivities.beginning.resources || '',
                                  font: FONT_FAMILY,
                                  size: sz(19),
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),

                    // Middle Activity
                    new TableRow({
                      children: [
                        new TableCell({
                          width: { size: 1600, type: WidthType.DXA },
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: `Middle (${session.planActivities.middle.timingMinutes || 60}')`,
                                  bold: true,
                                  font: FONT_FAMILY,
                                  size: sz(19),
                                }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          width: { size: 5900, type: WidthType.DXA },
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: session.planActivities.middle.description || '',
                                  font: FONT_FAMILY,
                                  size: sz(19),
                                }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          width: { size: 2000, type: WidthType.DXA },
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: session.planActivities.middle.resources || '',
                                  font: FONT_FAMILY,
                                  size: sz(19),
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),

                    // End Activity
                    new TableRow({
                      children: [
                        new TableCell({
                          width: { size: 1600, type: WidthType.DXA },
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: `End (${session.planActivities.end.timingMinutes || 10}')`,
                                  bold: true,
                                  font: FONT_FAMILY,
                                  size: sz(19),
                                }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          width: { size: 5900, type: WidthType.DXA },
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: session.planActivities.end.description || '',
                                  font: FONT_FAMILY,
                                  size: sz(19),
                                }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell({
                          width: { size: 2000, type: WidthType.DXA },
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: session.planActivities.end.resources || '',
                                  font: FONT_FAMILY,
                                  size: sz(19),
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),

        // 12. Reflection & Evaluation Header
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              width: { size: 9500, type: WidthType.DXA },
              shading: { fill: COLOR_GRAY_HEADER, type: ShadingType.CLEAR },
              children: [
                new Paragraph({
                  spacing: sp(40, 40),
                  children: [
                    new TextRun({
                      text: 'Reflection and Evaluation',
                      bold: true,
                      font: FONT_FAMILY,
                      size: sz(20),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),

        // 13. Reflection & Evaluation Content
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2,
              width: { size: 9500, type: WidthType.DXA },
              children: [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  spacing: sp(40, 40),
                  children: [
                    new TextRun({
                      text: 'Reflection and Evaluation:',
                      bold: true,
                      font: FONT_FAMILY,
                      size: sz(19),
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  spacing: sp(40, 40),
                  children: [
                    new TextRun({
                      text: session.reflectionEvaluation || '',
                      font: FONT_FAMILY,
                      size: sz(19),
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  spacing: sp(40, 40),
                  children: [
                    new TextRun({
                      text: 'Next Plan/Follow-up:',
                      bold: true,
                      font: FONT_FAMILY,
                      size: sz(19),
                    }),
                  ],
                }),
                new Paragraph({
                  alignment: AlignmentType.JUSTIFIED,
                  spacing: sp(40, 40),
                  children: [
                    new TextRun({
                      text: session.nextPlanFollowUp || '',
                      font: FONT_FAMILY,
                      size: sz(19),
                    }),
                  ],
                }),
                ...(session.plannedAssessment
                  ? [
                      new Paragraph({
                        alignment: AlignmentType.LEFT,
                        spacing: sp(40, 40),
                        children: [
                          new TextRun({
                            text: 'Planned Assessment:',
                            bold: true,
                            font: FONT_FAMILY,
                            size: sz(19),
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.JUSTIFIED,
                        spacing: sp(40, 40),
                        children: [
                          new TextRun({
                            text: session.plannedAssessment,
                            font: FONT_FAMILY,
                            size: sz(19),
                          }),
                        ],
                      }),
                    ]
                  : []),
              ],
            }),
          ],
        }),
      ],
    });

    sessionTables.push(sessionTable);
  });

  // Footer & Signatures Section
  const dateParagraph = new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: sp(40, 40),
    children: [
      new TextRun({
        text: plan.metadata.locationDate || 'South Tangerang, ______________, 2026',
        font: FONT_FAMILY,
        size: sz(20),
      }),
    ],
  });

  const formatSignatureParentheses = (name: string | undefined, fallback: string) => {
    const raw = (name || fallback).trim();
    const stripped = raw.replace(/^\s*\(\s*|\s*\)\s*$/g, '');
    return `(${stripped})`;
  };

  const signaturesTable = new Table({
    width: { size: 9500, type: WidthType.DXA },
    borders: borderlessTable,
    rows: [
      // Row 1: Headers ("Checked and Approved By:" spanning cols 1 & 2, "Designed By:" over col 3)
      new TableRow({
        children: [
          new TableCell({
            columnSpan: 2,
            width: { size: 6200, type: WidthType.DXA },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: sp(60, 100),
                children: [
                  new TextRun({
                    text: 'Checked and Approved By:',
                    bold: true,
                    font: FONT_FAMILY,
                    size: sz(20),
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 3300, type: WidthType.DXA },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: sp(60, 100),
                children: [
                  new TextRun({
                    text: 'Designed By:',
                    bold: true,
                    font: FONT_FAMILY,
                    size: sz(20),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),

      // Row 2: 3 Columns (Principal | Curriculum VP | Subject Teacher)
      new TableRow({
        children: [
          // Column 1: High School Principal
          new TableCell({
            width: { size: 3100, type: WidthType.DXA },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: sp(40, 0),
                children: [
                  new TextRun({
                    text: 'High School Principal',
                    bold: true,
                    font: FONT_FAMILY,
                    size: sz(19),
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 800, after: 0 },
                children: [
                  new TextRun({
                    text: '',
                    font: FONT_FAMILY,
                    size: sz(19),
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: sp(0, 40),
                children: [
                  new TextRun({
                    text: formatSignatureParentheses(
                      plan.metadata.principalName,
                      'Chabib Mustofa S.Pd.I, M.Pd'
                    ),
                    bold: true,
                    font: FONT_FAMILY,
                    size: sz(19),
                  }),
                ],
              }),
            ],
          }),

          // Column 2: Curriculum Vice Principal
          new TableCell({
            width: { size: 3100, type: WidthType.DXA },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: sp(40, 0),
                children: [
                  new TextRun({
                    text: 'Curriculum Vice Principal',
                    bold: true,
                    font: FONT_FAMILY,
                    size: sz(19),
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 800, after: 0 },
                children: [
                  new TextRun({
                    text: '',
                    font: FONT_FAMILY,
                    size: sz(19),
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: sp(0, 40),
                children: [
                  new TextRun({
                    text: formatSignatureParentheses(
                      plan.metadata.curriculumVpName,
                      'Nur Intan Kumalasari M.Pd'
                    ),
                    bold: true,
                    font: FONT_FAMILY,
                    size: sz(19),
                  }),
                ],
              }),
            ],
          }),

          // Column 3: Subject Teacher
          new TableCell({
            width: { size: 3300, type: WidthType.DXA },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: sp(40, 0),
                children: [
                  new TextRun({
                    text: 'Subject Teacher,',
                    bold: true,
                    font: FONT_FAMILY,
                    size: sz(19),
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 800, after: 0 },
                children: [
                  new TextRun({
                    text: '',
                    font: FONT_FAMILY,
                    size: sz(19),
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: sp(0, 40),
                children: [
                  new TextRun({
                    text: formatSignatureParentheses(
                      plan.metadata.teacherName,
                      'Salman Madani, S.Pd.'
                    ),
                    bold: true,
                    font: FONT_FAMILY,
                    size: sz(19),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: FONT_FAMILY,
            size: sz(22),
          },
          paragraph: {
            alignment: AlignmentType.JUSTIFIED,
            spacing: {
              line: LINE_SPACING_TWIPS,
              lineRule: LineRuleType.AUTO,
              after: Math.round(50 * PARA_SPACING_RATIO),
            },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 in
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: [
          headerTable,
          titleParagraph,
          metadataTable,
          new Paragraph({ spacing: sp(160, 0) }),
          outcomesTable,
          ...sessionTables,
          dateParagraph,
          signaturesTable,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const filename = generateDocxFilename(plan);
  saveAs(blob, filename);
}

/**
 * Generate standardized docx filename:
 * Academic Year_Grade_Term_Week_Subject (Code)_Topic
 * Example: 2627_G10_T1_W7_Chemistry (0620)_periodic table.docx
 */
export function generateDocxFilename(plan: LessonPlanData): string {
  const meta = plan.metadata || ({} as any);

  // 1. Academic Year (e.g. "2026/2027" -> "2627", "26/27" -> "2627")
  let ay = '2627';
  if (meta.academicYear) {
    const nums = meta.academicYear.match(/\d+/g);
    if (nums && nums.length >= 2) {
      ay = `${nums[0].slice(-2)}${nums[1].slice(-2)}`;
    } else if (nums && nums.length === 1 && nums[0].length === 4) {
      ay = nums[0];
    } else {
      ay = meta.academicYear.replace(/[^a-zA-Z0-9]/g, '') || '2627';
    }
  }

  // 2. Grade (e.g. "Grade 10 / Semester 1" -> "G10", "11" -> "G11")
  let grade = 'G10';
  if (meta.gradeSemester) {
    const m = meta.gradeSemester.match(/(?:Grade|G|Kelas)?\s*(1[0-2]|[7-9])/i);
    if (m) {
      grade = `G${m[1]}`;
    }
  }

  // 3. Term (e.g. "Term 1", "T1", "Semester 1", "Sem 1" -> "T1")
  let term = 'T1';
  const combinedTermSearch = `${meta.gradeSemester || ''} ${meta.periodWeek || ''}`;
  const termMatch = combinedTermSearch.match(/(?:Term|T)\s*([1-4])/i);
  if (termMatch) {
    term = `T${termMatch[1]}`;
  } else {
    const semMatch = combinedTermSearch.match(/(?:Semester|Sem|\/)\s*([1-2])/i);
    if (semMatch) {
      term = `T${semMatch[1]}`;
    }
  }

  // 4. Week (e.g. "Week 7", "W7", "Period 1 / Week 4" -> "W7", "W4")
  let week = 'W1';
  if (meta.periodWeek) {
    const wMatch = meta.periodWeek.match(/(?:Week|W|Minggu|Pekan)\s*(\d+)/i) || meta.periodWeek.match(/\b(\d+)\b/);
    if (wMatch) {
      week = `W${wMatch[1]}`;
    }
  }

  // 5. Subject (Code) (e.g. "Chemistry (0620)")
  const CAMBRIDGE_CODES: Record<string, string> = {
    chemistry: 'Chemistry (0620)',
    physics: 'Physics (0625)',
    biology: 'Biology (0610)',
    mathematics: 'Mathematics (0580)',
    math: 'Mathematics (0580)',
    'computer science': 'Computer Science (0478)',
    economics: 'Economics (0455)',
    'business studies': 'Business Studies (0450)',
    business: 'Business Studies (0450)',
    english: 'English (0500)',
    'combined science': 'Combined Science (0653)',
  };

  let subjectWithCode = (meta.subject || 'Chemistry (0620)').trim();
  if (!/\([^)]+\)/.test(subjectWithCode)) {
    const lower = subjectWithCode.toLowerCase();
    for (const key of Object.keys(CAMBRIDGE_CODES)) {
      if (lower.includes(key)) {
        subjectWithCode = CAMBRIDGE_CODES[key];
        break;
      }
    }
  }

  // 6. Topic (e.g. "periodic table")
  let topic = (meta.topicOfDiscussion || 'Lesson Plan')
    .replace(/[\\/:*?"<>|]/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

  return `${ay}_${grade}_${term}_${week}_${subjectWithCode}_${topic}.docx`;
}
