# Legacy QIS V3 流程解析

來源：

- `C:\Users\Jieming\Documents\GitHub\www\sysdep\FUNCTION\QIS_V3\QIS_wizard.htm`
- `C:\Users\Jieming\Documents\GitHub\www\sysdep\FUNCTION\QIS_V3\mobile\pages\*`
- `C:\Users\Jieming\Documents\GitHub\www\sysdep\FUNCTION\QIS_V3\mobile\js\qisData.js`
- `C:\Users\Jieming\Documents\GitHub\www\sysdep\FUNCTION\QIS_V3\mobile\js\handler.js`
- `C:\Users\Jieming\Documents\GitHub\www\sysdep\FUNCTION\QIS_V3\mobile\js\plugins.js`

原則：

- Stage/page/function 名稱只使用 Legacy 已存在的名稱。
- NVRAM 清單以 `qisData.js` 物件為主，並另列 `handler.js` / `plugins.js` 明確寫入的 legacy dynamic keys；不自行新增推測參數。
- CSS variable 依 `www\css\color-table.css`，QIS 共用樣式依 `QIS_V3\mobile\css\qis.css`。

## 1. QIS 初始化與主題

```mermaid
flowchart TD
  Load["QIS_wizard.htm"] --> Theme{"theme decision"}
  Theme -->|isSupport('rog')| ROG["data-asuswrt-theme=rog"]
  Theme -->|isSupport('tuf')| TUF["data-asuswrt-theme=tuf"]
  Theme -->|isSupport('BUSINESS')| Business["data-asuswrt-theme=business"]
  Theme -->|isSupport('proart')| ProArt["data-asuswrt-theme=proart"]
  Theme -->|default| ASUS["data-asuswrt-theme=asus"]
  ROG --> UI4{"isSupport('UI4')"}
  TUF --> UI4
  Business --> UI4
  ProArt --> UI4
  ASUS --> UI4
  UI4 -->|yes| Color{"productid GT-BE19000AI/GT-BE96_AI<br/>or business<br/>or odmpid startsWith ZenWiFi"}
  UI4 -->|no| Dark["data-asuswrt-color=dark"]
  Color -->|yes| Light["data-asuswrt-color=light"]
  Color -->|no| DarkUi4["data-asuswrt-color=dark"]
  Light --> Year{"isSupport('YEAR20')"}
  Dark --> Year
  DarkUi4 --> Year
  Year -->|yes| Style["data-asuswrt-style=20th"]
  Year -->|no| Init["initNvram + systemVariable"]
  Style --> Init
  Init --> Policy["PolicyStatus()"]
  Policy -->|EULA required| EULA["goTo.EULA() / policy_page"]
  Policy -->|PP required| PP["goTo.PP() / policy_page"]
  Policy -->|passed| Flag{"URL flag"}
  Flag -->|sitesurvey_rep| RpDirect["goTo.rpMode()"]
  Flag -->|lanip| ApDirect["goTo.apMode()"]
  Flag -->|sitesurvey_mb| MbDirect["goTo.mbMode()"]
  Flag -->|manual| OpMode["goTo.opMode() / opMode_page"]
  Flag -->|pppoe| Pppoe["goTo.PPPoE() / pppoe_setting"]
  Flag -->|wireless or mlo| Wireless["goTo.Wireless() / wireless_setting"]
  Flag -->|amasrole_page| Role["goTo.chooseRole() / amasrole_page"]
  Flag -->|amasnode_page| Node["goTo.asNode() / amasnode_page"]
  Flag -->|amas_addNode| Search["goTo.amassearch() / amassearch_page"]
  Flag -->|rtMode| RtFlag["advSetting=true -> goTo.rtMode()"]
  Flag -->|wispMode| WispFlag["advSetting=true -> goTo.wispMode()"]
  Flag -->|default| Welcome["goTo.Welcome() / welcome"]
```

## 2. Create a network 與 Advanced Settings 入口

```mermaid
flowchart TD
  Welcome["welcome"] --> Create["apply.welcome()"]
  Welcome --> RtQuick["apply.welcome_rt()"]
  Welcome --> WispQuick["apply.welcome_wisp()"]
  Welcome --> Advanced["goTo.advSetting() / advanced_setting"]

  Create --> ForcePw{"forceChangePw?"}
  ForcePw -->|yes| Login["login_name -> apply.login()"]
  ForcePw -->|no| Origin{"originOpMode"}
  Login --> Origin

  Origin -->|RT| RtAuto["goTo.autoWan() or goTo.autoDSLWan()"]
  Origin -->|AP + apMode_detwan| ApAuto["goTo.autoWan_AP()"]
  Origin -->|AP| ApMode["goTo.apMode()"]
  Origin -->|RP| RpMode["goTo.rpMode()"]
  Origin -->|MB| MbMode["goTo.mbMode()"]
  Origin -->|WISP| WispMode["goTo.wispMode()"]
  Origin -->|Mesh| MeshMode["goTo.meshMode()"]

  RtQuick --> RtPw{"forceChangePw?"}
  RtPw -->|yes| LoginRt["login_name"]
  RtPw -->|no| RtMode["goTo.rtMode()"]
  WispQuick --> WispPw{"forceChangePw?"}
  WispPw -->|yes| LoginWisp["login_name"]
  WispPw -->|no| WispMode

  Advanced --> ChangeMode["apply.changeOpMode()"]
  ChangeMode --> OpMode["opMode_page"]
```

## 3. Wireless Router mode

### 3.1 Create a network / auto detect

```mermaid
flowchart TD
  Entry["welcome -> apply.welcome()"] --> AutoWan["goTo.autoWan()"]
  AutoWan --> ClearWan["postDataModel.remove(wanObj.all)<br/>cfg_master=1 if amas"]
  ClearWan --> S46{"JP + s46 + IPv6 enabled?"}
  S46 -->|V6PLUS / OCNVC / DSLITE / V6OPTION| Wan46["wan46_page"]
  S46 -->|skip| DetWan{"detwanResult.wanType"}
  Wan46 --> Wireless
  DetWan -->|DHCP| Waiting["waiting_page"]
  DetWan -->|DHCPSPECIALISP| SpecialIsp["special_isp_requirement"]
  DetWan -->|PPPoE| PPPoE["pppoe_setting"]
  DetWan -->|STATIC| Static["static_setting"]
  DetWan -->|NOWAN| NoWan["noWan_page"]
  DetWan -->|MODEM| Modem["modem_setting"]
  DetWan -->|RESETMODEM| Reset["resetModem_page"]
  DetWan -->|CONNECTED| Wireless["wireless_setting"]
  DetWan -->|CHECKING or empty| Waiting
  Waiting --> AutoWan
  SpecialIsp -->|Yes| IPTV["iptv_setting"]
  SpecialIsp -->|No| Wireless
  PPPoE --> IPTVChoice{"IPTV checked?"}
  Static --> IPTVChoice
  IPTVChoice -->|yes| IPTV
  IPTVChoice -->|no| Wireless
  IPTV --> DhcpOpt{"DHCP option checked?"}
  DhcpOpt -->|yes| DhcpOption["wan_dhcp_option_setting"]
  DhcpOpt -->|no| Wireless
  DhcpOption --> Wireless
  Modem --> Wireless
  NoWan -->|Manual_Setting_btn| Manual["apply.manual()"]
  Reset --> Manual
  Wireless --> Submit["apply.wireless() -> apply.submitQIS()"]
  Submit --> Finish["result_page"]
```

### 3.2 Advanced Settings / manual WAN

```mermaid
flowchart TD
  OpMode["advanced_setting -> opMode_page"] --> RT["goTo.rtMode()"]
  RT --> ModeNvram["sw_mode=1<br/>wlc_psta=0<br/>wlc_dpsta=0<br/>wlc_band=''"]
  ModeNvram --> RestoreLan{"advSetting && isSwModeChanged()"}
  RestoreLan -->|yes| LanDefault["lan_proto=static<br/>lan_dnsenable_x=1<br/>lan_ipaddr=lan_ipaddr_rt default<br/>lan_netmask=lan_netmask_rt default<br/>lan_gateway=lan_ipaddr_rt"]
  RestoreLan -->|no| Manual
  LanDefault --> Manual["apply.manual()"]
  Manual --> WanPort{"2p5G_LWAN / 10G_LWAN / 10GS_LWAN<br/>or multiple eth WAN / usb_bk?"}
  WanPort -->|yes| WanOption["wanOption_setting"]
  WanPort -->|no| Wan["wan_setting"]
  WanOption -->|apply.WAN1G / WAN2p5G / WAN10G / WAN10GS| Wan
  WanOption -->|apply.WANModem| Modem["modem_setting"]
  Wan --> DHCP["goTo.DHCP() -> apply.dhcp()"]
  Wan --> PPPoE["goTo.PPPoE() -> pppoe_setting -> apply.pppoe()"]
  Wan --> Static["goTo.Static() -> static_setting -> apply.static()"]
  Wan --> PPTP["goTo.PPTP() -> pppoe_setting -> getIp_setting"]
  Wan --> L2TP["goTo.L2TP() -> pppoe_setting -> getIp_setting"]
  DHCP --> Optional["IPTV / DHCP option / modem optional branches"]
  PPPoE --> Optional
  Static --> Optional
  PPTP --> Optional
  L2TP --> Optional
  Modem --> Wireless["wireless_setting"]
  Optional --> Wireless
  Wireless --> Finish["apply.submitQIS() -> result_page"]
```

## 4. Access Point mode

```mermaid
flowchart TD
  Entry["Create originOpMode AP<br/>or Advanced opMode_page"] --> Det{"apMode_detwan and create path?"}
  Det -->|yes| AutoAP["goTo.autoWan_AP()"]
  Det -->|no| AP["goTo.apMode()"]
  AutoAP --> ClearWAN["postDataModel.remove(wanObj.all)<br/>cfg_master=1 if amas"]
  ClearWAN --> APWan{"detwanResult.wanType"}
  APWan -->|NOWAN| NoWanAP["goTo.NoWan_AP() / noWan_page"]
  APWan -->|CONNECTED| LanDhcpAP["goTo.lanDHCP_AP()"]
  APWan -->|default| WaitingAP["goTo.Waiting_AP() / waiting_page"]
  NoWanAP -->|manual button| AP
  NoWanAP -->|CONNECTED| LanDhcpAP
  NoWanAP -->|default| WaitingAP
  WaitingAP -->|CONNECTED| AutoAP
  WaitingAP -->|timeout US/CA/U2| ResetAP["goTo.ResetModem_AP() / resetModem_page"]
  WaitingAP -->|timeout others| AP
  ResetAP --> AutoAP
  AP --> ApNvram["sw_mode=3<br/>wlc_psta=0<br/>wlc_dpsta=0"]
  ApNvram --> GetLan["getLanIp_setting"]
  GetLan --> LanChoice{"LAN IP"}
  LanChoice -->|DHCP| LanDhcp["goTo.lanDHCP() / goTo.lanDHCP_AP()<br/>lan_proto=dhcp<br/>lan_dnsenable_x=1"]
  LanChoice -->|Static| LanStatic["lanStatic_setting -> apply.lanStatic()"]
  LanDhcpAP --> Wireless["wireless_setting"]
  LanDhcp --> Wireless
  LanStatic --> Wireless
  Wireless --> Finish["apply.submitQIS() -> result_page"]
```

## 5. Media Bridge mode

```mermaid
flowchart TD
  Entry["Create originOpMode MB<br/>or Advanced opMode_page"] --> MB["goTo.mbMode()"]
  MB --> Chip{"qcawifi/rawifi?"}
  Chip -->|yes| Qca["sw_mode=2<br/>wlc_psta=1<br/>wlc_dpsta=0"]
  Chip -->|no| Other["sw_mode=3<br/>wlc_psta=1<br/>wlc_dpsta=0"]
  Qca --> Survey
  Other --> Survey["siteSurvey_page"]
  Survey --> PapList["papList_page"]
  PapList --> PapChoice{"PAP selection"}
  PapChoice -->|open/OWE| LanPap["goTo.lanIP_papList()"]
  PapChoice -->|secured| WlcKey["wlcKey_setting -> apply.wlcKey()"]
  PapChoice -->|manual| WlcManual["wlcKey_setting manual -> apply.wlcKey()"]
  WlcKey --> LanPap
  WlcManual --> LanPap
  LanPap --> LanChoice{"LAN IP"}
  LanChoice -->|DHCP| LanDhcp["goTo.lanDHCP()"]
  LanChoice -->|Static| LanStatic["lanStatic_setting -> apply.lanStatic()"]
  LanDhcp --> MbSubmit["MB direct submit<br/>transformWLCObj() or copyWLCObj_wlc1ToWlc2()"]
  LanStatic --> MbSubmit
  MbSubmit --> Finish["result_page"]
```

## 6. Repeater mode

```mermaid
flowchart TD
  Entry["Create originOpMode RP<br/>or Advanced opMode_page"] --> RP["goTo.rpMode()"]
  RP --> Branch{"support branch"}
  Branch -->|concurrep + bcmwifi| Concur["sw_mode=3<br/>wlc_psta=2<br/>wlc_dpsta=dpsr?2:1"]
  Branch -->|amas + bcmwifi| AmasBcm["sw_mode=3<br/>wlc_psta=2<br/>wlc_dpsta=0"]
  Branch -->|others| Others["sw_mode=2<br/>wlc_psta=0<br/>wlc_dpsta=0"]
  Concur --> Survey
  AmasBcm --> Survey
  Others --> Survey["siteSurvey_page"]
  Survey --> PapList["papList_page"]
  PapList --> PapChoice{"PAP selection"}
  PapChoice -->|open/OWE| LanPap["goTo.lanIP_papList()"]
  PapChoice -->|secured| WlcKey["wlcKey_setting -> apply.wlcKey()"]
  PapChoice -->|manual| WlcManual["wlcKey_setting manual -> apply.wlcKey()"]
  WlcKey --> LanPap
  WlcManual --> LanPap
  LanPap --> Wireless["wireless_setting"]
  Wireless --> Transform["apply.wireless(): transformWLToGuest()<br/>if !concurrep transformWLCObj()"]
  Transform --> Finish["apply.submitQIS() -> result_page"]
```

## 7. WISP mode

```mermaid
flowchart TD
  Entry["welcome WISP / originOpMode WISP<br/>or Advanced opMode_page"] --> WISP["goTo.wispMode()"]
  WISP --> WispObj["insert wispObj:<br/>sw_mode=1<br/>wlc_psta=0<br/>wlc_dpsta=0<br/>wans_dualwan='wan none'<br/>wan_unit=0"]
  WispObj --> Survey["siteSurvey_page"]
  Survey --> PapList["papList_page"]
  PapList --> PapChoice{"PAP selection"}
  PapChoice -->|open/OWE| LanPap["goTo.lanIP_papList()"]
  PapChoice -->|secured| WlcKey["wlcKey_setting -> apply.wlcKey()"]
  PapChoice -->|manual| WlcManual["wlcKey_setting manual -> apply.wlcKey()"]
  WlcKey --> LanPap
  WlcManual --> LanPap
  LanPap --> Wan["wan_setting / protocol branch"]
  Wan --> DHCP["DHCP"]
  Wan --> PPPoE["PPPoE"]
  Wan --> Static["Static if exposed by wan_setting"]
  DHCP --> Wireless["wireless_setting"]
  PPPoE --> Wireless
  Static --> Wireless
  Wireless --> WispSubmit["apply.submitQIS(): collapse wlcN_* to wlc_*<br/>autowan_enable=0 if bcmwifi"]
  WispSubmit --> Finish["result_page"]
```

## 8. AiMesh mode

```mermaid
flowchart TD
  Entry["Create originOpMode Mesh<br/>or Advanced opMode_page -> AiMesh"] --> Mesh["goTo.meshMode()"]
  Mesh --> Role["goTo.chooseRole() / amasrole_page"]
  Role --> Router["asRouter path"]
  Role --> Node["apply.amasNode() / amasnode_page"]
  Router --> RtFlow["Wireless Router flow<br/>cfg_master=1"]
  Node --> IsDefault{"systemVariable.isDefault?"}
  IsDefault -->|no| Restore["amasrestore_page"]
  IsDefault -->|yes| ConnCap["amasconncap_page"]
  Restore --> ConnCap
  ConnCap --> Search["amassearch_page"]
  Search --> Bundle["amasbundle_page"]
  Bundle --> Onboarding["amasonboarding_page -> apply.amasonboarding()"]
  Onboarding --> Finish["result_page / onboarding status"]
```

## 9. WAN port / protocol

```mermaid
flowchart TD
  Manual["apply.manual()"] --> NeedPort{"2p5G_LWAN / 10G_LWAN / 10GS_LWAN<br/>eth_wan_list > 1 / usb_bk"}
  NeedPort -->|yes| Port["wanOption_setting"]
  NeedPort -->|no| Wan["wan_setting"]
  Port --> WAN1G["apply.WAN1G(): wans_extwan=0 / wans_dualwan='wan none' / autowan_enable=0"]
  Port --> WAN25["apply.WAN2p5G(): wans_extwan=1 / autowan_enable=0"]
  Port --> WAN10["apply.WAN10G(): wans_dualwan='wan2 none' / autowan_enable=0"]
  Port --> WAN10S["apply.WAN10GS(): wans_dualwan='sfp+ none' / autowan_enable=0"]
  Port --> WANModem["apply.WANModem(): goTo.Modem()"]
  WAN1G --> Wan
  WAN25 --> Wan
  WAN10 --> Wan
  WAN10S --> Wan
  Wan --> DHCP["goTo.DHCP(): wan_proto=dhcp + wanObj.dhcp"]
  Wan --> PPPoE["goTo.PPPoE(): wan_proto=pppoe + wanObj.pppoe"]
  Wan --> Static["goTo.Static(): wan_proto=static + wanObj.staticIp"]
  Wan --> PPTP["goTo.PPTP(): wan_proto=pptp + wanObj.pppoe + wanObj.vpn"]
  Wan --> L2TP["goTo.L2TP(): wan_proto=l2tp + wanObj.pppoe + wanObj.vpn"]
  Wan --> V6["goTo.V6PLUS/OCNVC/V6OPT/DSLITE(): wan46_page"]
```

## 10. 模式切換

```mermaid
flowchart TD
  Advanced["advanced_setting"] --> Change["apply.changeOpMode()"]
  Change --> Op["opMode_page"]
  Op --> RT["goTo.rtMode()"]
  Op --> AP["goTo.apMode()"]
  Op --> RP["goTo.rpMode()"]
  Op --> MB["goTo.mbMode()"]
  Op --> WISP["goTo.wispMode()"]
  Op --> AiMesh["goTo.amasIntro() / AiMesh pages"]
  RT --> RtFlow["Router WAN + wireless flow"]
  AP --> ApFlow["LAN IP + wireless flow"]
  RP --> RpFlow["siteSurvey + WLC + wireless flow"]
  MB --> MbFlow["siteSurvey + WLC + LAN IP flow"]
  WISP --> WispFlow["siteSurvey + WLC + WAN + wireless flow"]
  AiMesh --> MeshFlow["role / node onboarding flow"]
```

| To | 核心 legacy NVRAM |
| --- | --- |
| Wireless Router | `sw_mode=1`, `wlc_psta=0`, `wlc_dpsta=0`, `wlc_band=""`; AP/RP/MB/WISP 切回 RT 且 `advSetting && isSwModeChanged()` 時還原 RT 預設 LAN |
| Access Point | `sw_mode=3`, `wlc_psta=0`, `wlc_dpsta=0`; 接續 `getLanIp_setting` |
| Repeater | concurrep+bcmwifi: `sw_mode=3`, `wlc_psta=2`, `wlc_dpsta=dpsr?2:1`; amas+bcmwifi: `sw_mode=3`, `wlc_psta=2`, `wlc_dpsta=0`; others: `sw_mode=2`, `wlc_psta=0`, `wlc_dpsta=0` |
| Media Bridge | qcawifi/rawifi: `sw_mode=2`, `wlc_psta=1`, `wlc_dpsta=0`; others: `sw_mode=3`, `wlc_psta=1`, `wlc_dpsta=0` |
| WISP | `sw_mode=1`, `wlc_psta=0`, `wlc_dpsta=0`, `wans_dualwan="wan none"`, `wan_unit=0` |
| AiMesh | Router role follows RT with `cfg_master=1`; node role uses onboarding command data |

## 11. CSS 輸出

- 共用 QIS CSS 寫入 `packages\shared\src\assets\qis.css`。
- 主題變數寫入 `packages\shared\src\assets\color-table.css`。
- `packages\shared\src\assets\main.css` 先匯入 `color-table.css`，再匯入 `qis.css`，符合 Legacy `color-table.css -> qis.css` 的載入順序。

