export const devices = [
  {
    id: "dr",
    name: "DR 数字化X线摄影（Digital Radiography）",
    shortName: "DR",
    model: "/models/dr.glb",
    summary:
      "“快速的平面摄影师”。原理：利用X射线穿透人体，骨骼等密度高的组织吸收多，在片子上呈白色；肺部等含气组织吸收少，呈黑色。优点：速度快、价格经济、辐射剂量相对较低。缺点：影像前后重叠，缺乏立体感，对软组织的分辨能力有限。主要用于骨骼、胃肠道、泌尿系统、胸部检查。",
    camera: { position: [0, 2.5, 7.5], target: [0, 0.8, 0] },
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
    name: "CT 计算机断层扫描（Computed Tomography）",
    shortName: "CT",
    model: "/models/ct.glb",
    summary:
      "“高效的立体侦探”。原理：用X射线把身体像面包一样“切”成一片一片地看，通过计算机处理，将多个层面的图像重建成清晰的三维立体模型。优点：图像清晰无重叠，能发现细微病变，扫描速度极快。缺点：有一定的辐射剂量。可用于全身任何部位组织器官的检查，已成为临床常规的影像检查方法。",
    camera: { position: [0, 2.3, 7.5], target: [0, 0.7, 0] },
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
    name: "DSA 数字减影血管造影（Digital Subtraction Angiography）",
    shortName: "DSA",
    model: "/models/dsa.glb",
    summary:
      "“剥离背景的血管地图师”。原理：用X射线给血管拍“动态电影”，并通过计算机“抠图”技术，把骨骼、软组织等背景全部减去，只留下纯净清晰的血管影像。优点：动态实时成像，能清晰显示血流方向、速度和血管狭窄程度，并且集诊断与治疗于一体。缺点：属于有创操作，辐射剂量相对较高，且需注射碘造影剂，存在过敏风险。是诊断血管性疾病的“金标准”，广泛应用于神经介入、心脏介入及肿瘤灌注治疗等领域。",
    camera: { position: [0, 2.4, 7.5], target: [0, 0.8, 0] },
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
    name: "MRI 核磁共振成像（Magnetic Resonance Imaging）",
    shortName: "MRI",
    model: "/models/mri.glb",
    summary:
      "“摇动氢质子的微观绘图师”。原理：把身体放进一个巨大的强磁场中，用特定频率的射频脉冲去“摇动”体内的氢原子核。当脉冲停止后，氢原子核“归位”时释放出的能量信号被计算机捕捉，从而绘制出组织器官的内部结构图。优点：无电离辐射，软组织分辨率极高，可进行多方位多参数成像。缺点：扫描时间较长，噪声大，且有严格禁忌症，体内有非兼容心脏起搏器、铁磁性金属异物等严禁检查。是中枢神经系统、骨关节肌肉系统及腹盆腔实质脏器病变的首选和精准检查手段。",
    camera: { position: [0, 2.3, 7.5], target: [0, 0.8, 0] },
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
    name: "超声诊断仪（Ultrasonography / Ultrasound）",
    shortName: "超声",
    model: "/models/ultrasound.glb",
    summary:
      "“倾听回声的动态声呐侦探”。原理：用探头向身体发射高频声波，像蝙蝠或声呐一样，通过“听”不同组织界面反射回来的回声强弱与时间差，经由计算机实时转换成连续动态的灰阶图像。优点：无电离辐射，可实现实时动态成像，设备便携，可床旁急诊，且价格低廉、无绝对禁忌症。缺点：对含气脏器及骨骼无法有效穿透，图像清晰度易受腹壁脂肪和操作者手法影响，且无法像CT/MRI那样提供全器官的断层解剖概览。是妇产科、腹部、心血管及甲状腺、乳腺等浅表器官的首选筛查工具，也是介入引导的“实时眼睛”。",
    camera: { position: [0, 2.2, 7.0], target: [0, 0.9, 0] },
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
