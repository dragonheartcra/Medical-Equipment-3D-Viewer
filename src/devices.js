export const devices = [
  {
    id: "dr",
    name: "DR 数字化X线摄影",
    shortName: "DR",
    model: "/models/dr.glb",
    summary: "悬吊式数字化X线摄影系统，用于常规X线摄影教学展示。",
    camera: { position: [0, 2.5, 6], target: [0, 0.8, 0] },
    parts: [
      {
        id: "xray-tube",
        name: "X线球管",
        position: [0.18, -0.01, 0.052],
        normal: [0.999, -0.035, -0.017],
        description: "产生X射线的核心部件，内部包含阴极、阳极、灯丝和真空管壳。",
        layers: [
          {
            title: "球管外观",
            image: "/images/01_DR_X线球管_1外观.jpg",
            text: "球管外壳用于保护内部真空组件，并连接悬吊臂完成角度调节。",
          },
          {
            title: "球管剖面",
            image: "/images/01_DR_X线球管_2剖面.png",
            text: "剖面图展示阴极、阳极靶面、旋转阳极结构和真空玻璃壳。",
          },
          {
            title: "球管结构",
            image: "/images/01_DR_X线球管_3结构.png",
            text: "更细结构展示灯丝、聚焦罩、阳极靶和窗口等组成关系。",
          },
        ],
      },
      {
        id: "flat-panel-detector",
        name: "平板探测器",
        position: [0.097, -0.286, 0.239],
        normal: [0, 1, 0],
        description: "接收穿过人体后的X线并转换为数字图像信号。",
        layers: [
          {
            title: "探测器外观",
            image: "/images/01_DR_平板探测器_1外观.webp",
            text: "平板探测器通常位于立柱或摄影床下方，是数字成像的接收端。",
          },
          {
            title: "非晶态硅结构",
            image: "/images/01_DR_平板探测器_2非晶态硅.png",
            text: "非晶态硅探测器通过闪烁体和光电二极管阵列完成间接转换。",
          },
          {
            title: "非晶态硒结构",
            image: "/images/01_DR_平板探测器_3非晶态硒.png",
            text: "非晶态硒探测器可直接将X线转换为电荷信号。",
          },
        ],
      },
    ],
  },
  {
    id: "ct",
    name: "CT 计算机断层扫描",
    shortName: "CT",
    model: "/models/ct.glb",
    summary: "CT通过旋转扫描采集多角度投影数据，重建人体断层图像。",
    camera: { position: [0, 2.3, 6], target: [0, 0.7, 0] },
    parts: [
      {
        id: "control-panel",
        name: "控制面板",
        position: [0.257, 0.1, -0.252],
        normal: [-0.119, -0.034, 0.992],
        description: "用于扫描参数设置、设备状态查看和基础操作控制。",
        layers: [
          {
            title: "控制面板",
            image: "/images/02_CT_控制面板.webp",
            text: "控制面板集中显示扫描参数和操作按钮，便于技师完成扫描流程。",
          },
        ],
      },
      {
        id: "gantry",
        name: "扫描机架",
        position: [-0.15, 0.212, -0.243],
        normal: [-0.086, 0.143, 0.986],
        description: "CT机架内包含X线管、探测器和旋转扫描结构。",
        layers: [
          {
            title: "机架透视图",
            image: "/images/02_CT_扫描机架_1透视图.png",
            text: "机架透视图展示扫描孔径、管球和探测器围绕患者旋转的结构关系。",
          },
          {
            title: "扫描工作原理",
            image: "/images/02_CT_扫描机架_2工作原理.png",
            text: "CT通过多角度投影采集数据，再由计算机重建断层图像。",
          },
        ],
      },
    ],
  },
  {
    id: "dsa",
    name: "DSA 数字减影血管造影",
    shortName: "DSA",
    model: "/models/dsa.glb",
    summary: "DSA用于血管造影和介入治疗过程中的动态影像观察。",
    camera: { position: [0, 2.4, 6.3], target: [0, 0.8, 0] },
    parts: [
      {
        id: "c-arm",
        name: "C形臂",
        position: [-0.108, 0.095, 0.017],
        normal: [-0.637, -0.014, 0.771],
        description: "承载X线源和探测器，可围绕患者调整角度。",
        layers: [
          {
            title: "DSA整体标注图",
            image: "/images/03_DSA_整体.png",
            text: "C形臂是DSA系统中实现多角度造影观察的关键机械结构。",
          },
        ],
      },
      {
        id: "patient-table",
        name: "导管床",
        position: [0.028, -0.097, 0.289],
        normal: [-0.003, 1, 0],
        description: "支撑患者并配合介入操作进行位置调整。",
        layers: [
          {
            title: "导管床位置",
            image: "/images/03_DSA_整体.png",
            text: "导管床用于承载患者，需与C形臂运动空间配合。",
          },
        ],
      },
      {
        id: "display-system",
        name: "显示系统",
        position: [0.029, 0.137, -0.301],
        normal: [0.933, -0.354, 0.069],
        description: "显示实时造影图像和操作过程信息。",
        layers: [
          {
            title: "显示系统",
            image: "/images/03_DSA_整体.png",
            text: "显示系统为医生提供实时血管影像反馈。",
          },
        ],
      },
    ],
  },
  {
    id: "mri",
    name: "MRI 核磁共振成像",
    shortName: "MRI",
    model: "/models/mri.glb",
    summary: "MRI利用强磁场和射频信号获取人体组织的断层图像。",
    camera: { position: [0, 2.3, 6], target: [0, 0.8, 0] },
    parts: [
      {
        id: "main-magnet",
        name: "主磁体线圈",
        position: [0.022, 0.162, 0.252],
        normal: [0.98, 0.125, 0.155],
        description: "产生稳定强磁场，是MRI系统的核心结构。",
        layers: [
          {
            title: "主磁体线圈",
            image: "/images/04_MRI_主磁体线圈.png",
            text: "主磁体线圈用于形成均匀强磁场，为磁共振信号采集提供基础。",
          },
        ],
      },
    ],
  },
  {
    id: "ultrasound",
    name: "超声诊断仪",
    shortName: "超声",
    model: "/models/ultrasound.glb",
    summary: "超声诊断仪通过探头发射和接收超声波，形成实时影像。",
    camera: { position: [0, 2.2, 5.2], target: [0, 0.9, 0] },
    parts: [
      {
        id: "probe",
        name: "超声探头",
        position: [0.135, 0.144, -0.178],
        normal: [-0.033, -0.116, -0.993],
        description: "探头是超声信号发射和接收的核心部件。",
        layers: [
          {
            title: "探头外观",
            image: "/images/05_US_探头_1外观.png",
            text: "探头与人体表面接触，将电信号转换为超声波并接收回波。",
          },
          {
            title: "探头内部结构",
            image: "/images/05_US_探头_2内部结构.png",
            text: "内部结构包含压电晶片、匹配层、背衬材料和声透镜等。",
          },
        ],
      },
    ],
  },
];
