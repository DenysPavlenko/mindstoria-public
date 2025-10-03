import { TTrackersData, TrackerMetricType } from "@/types";
import dayjs from "dayjs";
// import utc from "dayjs/plugin/utc";

// dayjs.extend(utc);

const data = `
2025-05-24	7	6	7	5	15	0	0
2025-05-25	3	6	7	7	15	25	0
2025-05-26	5	6	8	9	15	25	0
2025-05-27	7	6	7	8	15	25	0
2025-05-28	7	7	8	9	15	25	0
2025-05-29	7	7	6	7	15	25	0
2025-05-30	7	7	8	8	15	25	0
2025-05-31	6	6	7	7	15	25	0
2025-06-01	7	6	7	7	15	25	0
2025-06-02	6	7	8	9	15	25	0
2025-06-03	8	8	7	8	15	25	0
2025-06-04	6	9	7	6	15	25	0
2025-06-05	6	9	9	9	15	25	0
2025-06-06	8	9	9	10	15	25	0
2025-06-07	8	9	9	10	15	25	0
2025-06-08	8	8	8	10	15	37.5	0
2025-06-09	3	7	7	7	15	50	0
2025-06-10	3	7	8	8	15	50	0
2025-06-11	4	7	8	8	15	50	0
2025-06-12	4	7	8	8	15	50	0
2025-06-13	4	7	8	8	15	75	0
2025-06-14	7	9	8	8	15	75	0
2025-06-15	9	10	8	9	15	75	0
2025-06-16	8	10	9	10	15	75	0
2025-06-17	8	10	9	9	15	75	0
2025-06-18	8	10	9	9	15	75	0
2025-06-19	6	10	8	9	15	75	0
2025-06-20	4	7	7	6	15	75	0
2025-06-21	5	7	8	8	15	75	0
2025-06-22	5	7	8	6	15	75	0
2025-06-23	8	9	8	9	15	75	0
2025-06-24	8	9	9	9	15	75	0
2025-06-25	9	9	9	9	15	75	0
2025-06-26	9	10	9	9	15	62.5	0
2025-06-27	7	8	10	9	15	75	0
2025-06-28	7	10	9	10	15	75	0
2025-06-29	8	10	10	8	15	75	0
2025-06-30	10	10	9	9	15	75	0
2025-07-01	7	8	9	8	15	75	0
2025-07-02	5	7	9	9	15	75	0
2025-07-03	10	10	10	9	15	75	0
2025-07-04	10	10	10	10	15	75	0
2025-07-05	8	10	10	10	15	75	0
2025-07-06	8	10	10	10	15	75	0
2025-07-07	8	10	10	10	15	75	0
2025-07-08	10	10	10	8	15	62.5	0
2025-07-09	8	8	9	9	15	62.5	0
2025-07-10	8	10	10	9	15	62.5	0
2025-07-11	9	10	10	10	15	62.5	0
2025-07-12	6	8	10	9	15	62.5	0
2025-07-13	7	8	10	9	15	62.5	0
2025-07-14	9	10	10	10	15	62.5	0
2025-07-15	10	10	10	10	15	62.5	0
2025-07-16	10	10	10	10	15	50	0
2025-07-17	10	9	10	10	15	50	0
2025-07-18	9	10	10	10	15	50	0
2025-07-19	6	9	10	8	15	50	0
2025-07-20	9	10	10	8	15	50	0
2025-07-21	7	10	10	8	15	50	0
2025-07-22	10	9	9	8	15	50	0
2025-07-23	6	10	8	8	15	50	0
2025-07-24	5	7	7	9	15	50	0
2025-07-24	5	6	7	9	15	50	0
2025-07-25	7	6	8	9	15	50	0
2025-07-26	9	7	8	8	15	50	0
2025-07-27	5	7	8	9	15	75	0
2025-07-28	4	7	8	8	15	75	0
2025-07-29	7	8	9	9	15	50	0
2025-07-30	8	8	9	9	15	50	0
2025-07-31	7	8	9	9	15	62.5	0
2025-08-01	2	6	7	6	15	75	0
2025-08-02	9	8	10	10	15	75	0
2025-08-03	9	9	9	10	15	75	0
2025-08-04	6	9	9	9	15	75	0
2025-08-05	5	8	7	8	15	75	0
2025-08-06	5	8	8	8	15	75	0
2025-08-07	5	8	7	8	15	75	0
2025-08-08	4	8	7	8	15	75	3.75
2025-08-09	9	9	9	9	15	75	3.75
2025-08-10	8	8	8	9	15	75	3.75
2025-08-11	8	9	9	9	15	75	3.75
2025-08-12	8	9	9	9	15	50	3.75
2025-08-13	10	9	9	9	15	50	3.75
2025-08-14	9	9	9	9	15	50	3.75
2025-08-15	10	10	10	10	15	50	1.8
2025-08-16	10	10	10	10	15	50	1.8
2025-08-17	10	10	10	10	15	50	1.8
2025-08-18	6	8	9	9	15	50	3.75
2025-08-19	9	10	10	10	15	50	1.8
2025-08-20	9	9	10	8	15	37.5	1.8
2025-08-21	9	9	10	10	15	37.5	1.8
2025-08-22	10	9	10	10	15	37.5	1.8
2025-08-23	10	10	10	10	15	37.5	1.8
2025-08-24	10	10	10	10	15	32.5	1.8
2025-08-25	10	10	9	8	15	25	1.8
2025-08-26	7	10	9	9	15	32.5	1.8
2025-08-27	10	10	10	9	15	32.5	1.8
2025-08-28	10	10	10	10	15	25	1.8
2025-08-29	10	10	10	10	15	25	1.8
2025-08-30	10	10	10	10	15	25	1.8
2025-08-31	10	10	10	10	15	25	1.8
2025-09-01	9	10	10	10	15	25	1.8
2025-09-02	9	10	10	10	15	12.5	1.8
2025-09-03	10	10	10	10	15	12.5	1.8
2025-09-04	10	10	10	10	15	12.5	1.8
2025-09-05	10	10	10	10	15	12.5	1.8
2025-09-06	8	9	9	10	15	12.5	1.8
2025-09-07	8	9	9	9	15	12.5	1.8
2025-09-08	8	9	9	9	15	12.5	1.8
2025-09-09	10	10	10	10	15	12.5	1.8
2025-09-10	10	10	10	10	15	12.5	1.8
2025-09-11	10	10	10	10	15	12.5	1.8
2025-09-12	10	10	10	10	15	12.5	1.8
2025-09-13	10	10	10	10	15	12.5	1.8
2025-09-14	10	10	10	10	15	12.5	1.8
2025-09-15	10	10	10	10	15	12.5	1.8
2025-09-16	10	10	10	10	15	12.5	1.8
2025-09-17	10	10	10	10	15	12.5	0
2025-09-18	10	10	10	10	15	12.5	0
2025-09-19	10	10	10	10	15	12.5	0
2025-09-20	7	9	9	9	15	12.5	1.8
2025-09-21	10	10	10	10	15	12.5	1.8
2025-09-22	10	10	10	10	15	12.5	1.8
2025-09-23	10	10	10	10	15	12.5	1.8
2025-09-24	10	10	10	10	15	12.5	0
2025-09-25	10	10	10	10	15	12.5	0
2025-09-26	10	10	10	10	15	12.5	0
2025-09-27	8	9	8	8	15	12.5	1.8
2025-09-28	10	9	8	7	15	12.5	1.8
2025-09-29	8	9	9	9	15	12.5	1.8
2025-09-30	10	8	9	10	15	12.5	0
2025-10-01	10	9	9	9	15	12.5	0
2025-10-02	10	9	9	9	15	12.5	0
2025-10-03	10	9	9	9	15	12.5	0
2025-10-04	9	9	9	9	15	12.5	0
2025-10-05	10	10	9	10	15	12.5	0
2025-10-06	10	10	9	10	15	12.5	0
2025-10-07	10	8	9	10	15	12.5	0
2025-10-08	10	10	8	9	15	12.5	0
2025-10-09	10	10	10	10	15	12.5	0
2025-10-10	10	10	10	10	12.5	12.5	0
2025-10-11	10	10	10	10	10	12.5	0
2025-10-12	8	10	10	10	10	12.5	1.8
2025-10-13	7	10	10	10	10	12.5	0
2025-10-14	10	10	10	10	10	12.5	1.8
2025-10-15	10	10	10	10	10	12.5	1.8
2025-10-16	5	8	10	10	10	12.5	1.8
`;

export const mockData: TTrackersData = {
  trackers: {
    tracker1: {
      id: "tracker1",
      name: "Anxiety Tracker",
      iconName: "activity",
      description: "Track your anxiety levels over time",
      createdAt: "2025-05-01T00:00:00Z",
      order: 0,
      metrics: [
        {
          id: "t1col0",
          label: "Wake up time",
          type: TrackerMetricType.Time,
          config: null,
        },
        {
          id: "t1col1",
          label: "Did I meditate?",
          type: TrackerMetricType.Boolean,
          config: null,
        },
        {
          id: "t1col2",
          label: "Morning mood",
          type: TrackerMetricType.Range,
          config: {
            range: [1, 10],
          },
        },
        {
          id: "t1col3",
          label: "Afternoon mood",
          type: TrackerMetricType.Range,
          config: {
            range: [1, 10],
          },
        },
        {
          id: "t1col4",
          label: "Evening mood",
          type: TrackerMetricType.Range,
          config: {
            range: [1, 20],
          },
        },
        {
          id: "t1col5",
          label: "Comments",
          type: TrackerMetricType.Notes,
          config: null,
        },
        {
          id: "t1col6",
          label: "Weight",
          type: TrackerMetricType.Number,
          config: null,
        },
        {
          id: "t1col7",
          label: "Elliptical",
          type: TrackerMetricType.Duration,
          config: null,
        },
      ],
    },
    // tracker2: {
    //   id: "tracker2",
    //   iconName: "sun",
    //   name: "My Anxiety Tracker",
    //   description: null,
    //   createdAt: "2025-04-02T00:00:00Z",
    //   order: 1,
    //   metrics: [
    //     {
    //       id: "t2col1",
    //       label: "Sleep",
    //       type: TrackerMetricType.Range,
    //       config: {
    //         range: [1, 10],
    //       },
    //     },
    //     {
    //       id: "t2col2",
    //       label: "Morning mood",
    //       type: TrackerMetricType.Range,
    //       config: {
    //         range: [1, 10],
    //       },
    //     },
    //     {
    //       id: "t2col3",
    //       label: "Afternoon mood",
    //       type: TrackerMetricType.Range,
    //       config: {
    //         range: [1, 10],
    //       },
    //     },
    //     {
    //       id: "t2col4",
    //       label: "Evening mood",
    //       type: TrackerMetricType.Range,
    //       config: {
    //         range: [1, 10],
    //       },
    //     },
    //     {
    //       id: "t2col5",
    //       label: "Buspirone(mg)",
    //       type: TrackerMetricType.Number,
    //       config: null,
    //     },
    //     {
    //       id: "t2col6",
    //       label: "Trazodone(mg)",
    //       type: TrackerMetricType.Number,
    //       config: null,
    //     },
    //     {
    //       id: "t2col7",
    //       label: "Mirtazapine(mg)",
    //       type: TrackerMetricType.Number,
    //       config: null,
    //     },
    //   ],
    // },
  },
  entries: {
    tracker1: [
      {
        id: "entry1",
        trackerId: "tracker1",
        date: dayjs().subtract(13, "day").toString(),
        values: {
          t1col0: 25200, // 07:00 = 7 * 60 * 60 (seconds)
          t1col1: false,
          t1col2: 1,
          t1col3: 1,
          t1col4: 2,
          t1col5: "tired",
          t1col6: 70,
          t1col7: 0,
        },
        createdAt: dayjs().toString(),
      },
      {
        id: "entry2",
        trackerId: "tracker1",
        date: dayjs().subtract(12, "day").toString(),
        values: {
          t1col0: 25200, // 07:00 = 7 * 60 * 60 (seconds)
          t1col1: false,
          t1col2: 2,
          t1col3: 2,
          t1col4: 4,
          t1col5: "meh",
          t1col6: 70.5,
          t1col7: 1500,
        },
        createdAt: dayjs().toString(),
      },
      {
        id: "entry3",
        trackerId: "tracker1",
        date: dayjs().subtract(11, "day").toString(),
        values: {
          t1col0: 28800, // 08:00 = 8 * 60 * 60 (seconds)
          t1col1: true,
          t1col2: 3,
          t1col3: 3,
          t1col4: 6,
          t1col5: "ok",
          t1col6: 71,
          t1col7: 2100,
        },
        createdAt: dayjs().toString(),
      },
      {
        id: "entry4",
        trackerId: "tracker1",
        date: dayjs().subtract(10, "day").toString(),
        values: {
          t1col0: 28800, // 08:00 = 8 * 60 * 60 (seconds)
          t1col1: true,
          t1col2: 4,
          t1col3: 4,
          t1col4: 8,
          t1col5: "ok",
          t1col6: 71.2,
          t1col7: 1800,
        },
        createdAt: dayjs().toString(),
      },
      {
        id: "entry5",
        trackerId: "tracker1",
        date: dayjs().subtract(9, "day").toString(),
        values: {
          t1col0: 27600, // 07:40 = 7*60*60 + 40*60 (seconds)
          t1col1: false,
          t1col2: 5,
          t1col3: 5,
          t1col4: 10,
          t1col5: "meh",
          t1col6: 71.5,
          t1col7: 2400,
        },
        createdAt: dayjs().toString(),
      },
      {
        id: "entry6",
        trackerId: "tracker1",
        date: dayjs().subtract(8, "day").toString(),
        values: {
          t1col0: 27000, // 07:30 = 7*60*60 + 30*60 (seconds)
          t1col1: true,
          t1col2: 6,
          t1col3: 6,
          t1col4: 12,
          t1col5: "good",
          t1col6: 71.7,
          t1col7: 2700,
        },
        createdAt: dayjs().toString(),
      },
      {
        id: "entry7",
        trackerId: "tracker1",
        date: dayjs().subtract(7, "day").toString(),
        values: {
          t1col0: 26400, // 07:20 = 7*60*60 + 20*60 (seconds)
          t1col1: false,
          t1col2: 7,
          t1col3: 7,
          t1col4: 14,
          t1col5: "bad",
          t1col6: 71.3,
          t1col7: 1200,
        },
        createdAt: dayjs().toString(),
      },
      {
        id: "entry8",
        trackerId: "tracker1",
        date: dayjs().subtract(6, "day").toString(),
        values: {
          t1col1: true,
          t1col2: 8,
          t1col3: 8,
          t1col4: 16,
          t1col5: "ok",
          t1col6: 71.1,
          t1col7: 3000,
        },
        createdAt: dayjs().toString(),
      },
      {
        id: "entry9",
        trackerId: "tracker1",
        date: dayjs().subtract(5, "day").toString(),
        values: {
          t1col0: 25800, // 07:10 = 7*60*60 + 10*60 (seconds)
          t1col1: false,
          t1col2: 9,
          t1col3: 9,
          t1col4: 18,
          t1col5: "meh",
          t1col6: 70.9,
          t1col7: 1800,
        },
        createdAt: dayjs().toString(),
      },
      {
        id: "entry10",
        trackerId: "tracker1",
        date: dayjs().subtract(4, "day").toString(),
        values: {
          t1col0: 25200, // 07:00 = 7 * 60 * 60 (seconds)
          t1col1: true,
          t1col2: 10,
          t1col3: 10,
          t1col4: 20,
          t1col5: "good",
          t1col6: 70.7,
          t1col7: 2100,
        },
        createdAt: dayjs().toString(),
      },
      {
        id: "entry11",
        trackerId: "tracker1",
        date: dayjs().subtract(3, "day").toString(),
        values: {
          t1col0: 25200, // 07:00 = 7 * 60 * 60 (seconds)
          t1col1: false,
          t1col2: 5,
          t1col3: 7,
          t1col4: 15,
          t1col5: "bad",
          t1col6: 70.5,
          t1col7: 900,
        },
        createdAt: dayjs().toString(),
      },
      {
        id: "entry13",
        trackerId: "tracker1",
        date: dayjs().subtract(1, "day").toString(),
        values: {
          t1col0: 24600, // 06:50 = 6*60*60 + 50*60 (seconds)
          t1col1: false,
          t1col2: 8,
          t1col3: 6,
          t1col4: 10,
          t1col5: "great",
          t1col6: 70.2,
          t1col7: 2400,
        },
        createdAt: dayjs().toString(),
      },
      {
        id: "entry14",
        trackerId: "tracker1",
        date: dayjs().toString(),
        values: {
          t1col0: 24300, // 06:45 = 6*60*60 + 45*60 (seconds)
          t1col1: true,
          t1col2: 9,
          t1col3: 8,
          t1col4: 18,
          t1col5: "excellent",
          t1col6: 70,
          t1col7: 3600,
        },
        createdAt: dayjs().toString(),
      },
    ],
    // tracker2: [
    //   ...data
    //     .trim()
    //     .split("\n")
    //     .map((line, idx) => {
    //       const [date, t2col1, t2col2, t2col3, t2col4, t2col5, t2col6, t2col7] =
    //         line.split("\t");
    //       const parsedDate = dayjs.utc(date).toString();
    //       return {
    //         id: `entry${idx + 1}`,
    //         trackerId: "tracker2",
    //         date: parsedDate,
    //         values: {
    //           t2col1: Number(t2col1),
    //           t2col2: Number(t2col2),
    //           t2col3: Number(t2col3),
    //           t2col4: Number(t2col4),
    //           t2col5: Number(t2col5),
    //           t2col6: Number(t2col6),
    //           t2col7: Number(t2col7),
    //         },
    //         createdAt: parsedDate,
    //       };
    //     }),
    // ],
  },
};
