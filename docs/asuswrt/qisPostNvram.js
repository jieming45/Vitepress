const qisPostNvram = {
    "General_Settings": {
        "x_Setting": "1",
        "w_Setting": "1",
        "qis_Setting": "1",
        "http_username": "<admin_username>",
        "http_passwd": "<admin_password>"
    },
    "Router_Mode": {
        "Operation_Mode": {
            "sw_mode": "1",
            "wlc_psta": "",
            "wlc_dpsta": "",
            "wlc_band": ""
        },
        "WAN_Paths": {
            "DHCP": {
                "wan_proto": "dhcp",
                "wan_dhcpenable_x": "1",
                "wan_dnsenable_x": "1",
                "wan_vendorid": "<optional>",
                "wan_clientid_type": "<optional>",
                "wan_clientid": "<optional>"
            },
            "PPPoE": {
                "wan_proto": "pppoe",
                "wan_dhcpenable_x": "1",
                "wan_dnsenable_x": "1",
                "wan_pppoe_username": "<username>",
                "wan_pppoe_passwd": "<password>",
                "wan_heartbeat_x": "<optional>"
            },
            "Static_IP": {
                "wan_proto": "static",
                "wan_dhcpenable_x": "0",
                "wan_dnsenable_x": "0",
                "wan_ipaddr_x": "<ip>",
                "wan_netmask_x": "<mask>",
                "wan_gateway_x": "<gateway>",
                "wan_dns1_x": "<dns1>",
                "wan_dns2_x": "<dns2>"
            },
            "L2TP_PPTP": {
                "wan_proto": "l2tp|pptp",
                "wan_dhcpenable_x": "1",
                "wan_dnsenable_x": "1",
                "wan_pppoe_username": "<username>",
                "wan_pppoe_passwd": "<password>",
                "wan_heartbeat_x": "<server>"
            },
            "Modem": {
                "wans_dualwan": "wan usb",
                "modem_enable": "1",
                "modem_android": "<0|1>",
                "modem_autoapn": "<0|1>",
                "modem_country": "<country>",
                "modem_isp": "<isp>",
                "modem_apn": "<apn>",
                "modem_dialnum": "<dialnum>",
                "modem_user": "<user>",
                "modem_pass": "<password>",
                "Dev3G": "<device>"
            },
            "IPv6_Transition": {
                "ipv6_service": "ipv6pt",
                "wan_s46_dslite_mode": "<0|1>"
            }
        },
        "IPTV_Settings_Optional": {
            "switch_wantag": "manual|movistar",
            "switch_wan0tagid": "<vid>",
            "switch_wan0prio": "<prio>",
            "switch_wan1tagid": "<vid>",
            "switch_wan1prio": "<prio>",
            "switch_wan2tagid": "<vid>",
            "switch_wan2prio": "<prio>",
            "switch_stb_x": "<port>"
        }
    },
    "Access_Point_Mode": {
        "Operation_Mode": {
            "sw_mode": "3",
            "wlc_psta": "0",
            "wlc_dpsta": "0"
        },
        "LAN_Paths": {
            "DHCP": {
                "lan_proto": "dhcp",
                "lan_dnsenable_x": "1"
            },
            "Static_IP": {
                "lan_proto": "static",
                "lan_ipaddr": "<ip>",
                "lan_netmask": "<mask>",
                "lan_gateway": "<gateway>",
                "lan_dns1_x": "<dns1>",
                "lan_dns2_x": "<dns2>"
            }
        }
    },
    "Repeater_Mode": {
        "Operation_Mode": {
            "sw_mode": "2",
            "wlc_psta": "1",
            "wlc_dpsta": "0"
        },
        "Upstream_AP_Settings": {
            "wlcX_band": "<0|1|2>",
            "wlcX_ssid": "<ssid>",
            "wlcX_auth_mode": "<open|shared|psk|psk2|sae>",
            "wlcX_crypto": "<aes|tkip>",
            "wlcX_wpa_psk": "<password>",
            "wlcX_wep": "<0|1|2>",
            "wlcX_wep_key": "<key>",
            "wlcX_key": "<index>"
        },
        "LAN_Paths": {
            "DHCP": {
                "lan_proto": "dhcp",
                "lan_dnsenable_x": "1"
            },
            "Static_IP": {
                "lan_proto": "static",
                "lan_ipaddr": "<ip>",
                "lan_netmask": "<mask>",
                "lan_gateway": "<gateway>",
                "lan_dns1_x": "<dns1>",
                "lan_dns2_x": "<dns2>"
            }
        }
    },
    "Media_Bridge_Mode": {
        "Operation_Mode": {
            "sw_mode": "4",
            "wlc_psta": "2",
            "wlc_dpsta": "0"
        },
        "Upstream_AP_Settings": {
            "wlcX_band": "<0|1|2>",
            "wlcX_ssid": "<ssid>",
            "wlcX_auth_mode": "<open|shared|psk|psk2|sae>",
            "wlcX_crypto": "<aes|tkip>",
            "wlcX_wpa_psk": "<password>",
            "wlcX_wep": "<0|1|2>",
            "wlcX_wep_key": "<key>",
            "wlcX_key": "<index>"
        },
        "LAN_Paths": {
            "DHCP": {
                "lan_proto": "dhcp",
                "lan_dnsenable_x": "1"
            },
            "Static_IP": {
                "lan_proto": "static",
                "lan_ipaddr": "<ip>",
                "lan_netmask": "<mask>",
                "lan_gateway": "<gateway>",
                "lan_dns1_x": "<dns1>",
                "lan_dns2_x": "<dns2>"
            }
        }
    },
    "WISP_Mode": {
        "Operation_Mode": {
            "sw_mode": "1",
            "wlc_psta": "0",
            "wlc_dpsta": "0",
            "wans_dualwan": "wan none",
            "wan_unit": "0"
        },
        "Upstream_AP_Settings": {
            "wlcX_band": "<0|1|2>",
            "wlcX_ssid": "<ssid>",
            "wlcX_auth_mode": "<open|shared|psk|psk2|sae>",
            "wlcX_crypto": "<aes|tkip>",
            "wlcX_wpa_psk": "<password>",
            "wlcX_wep": "<0|1|2>",
            "wlcX_wep_key": "<key>",
            "wlcX_key": "<index>"
        },
        "WAN_Paths": {
            "DHCP": {
                "wan_proto": "dhcp",
                "wan_dhcpenable_x": "1",
                "wan_dnsenable_x": "1"
            },
            "PPPoE": {
                "wan_proto": "pppoe",
                "wan_dhcpenable_x": "1",
                "wan_dnsenable_x": "1",
                "wan_pppoe_username": "<username>",
                "wan_pppoe_passwd": "<password>"
            },
            "Static_IP": {
                "wan_proto": "static",
                "wan_dhcpenable_x": "0",
                "wan_dnsenable_x": "0",
                "wan_ipaddr_x": "<ip>",
                "wan_netmask_x": "<mask>",
                "wan_gateway_x": "<gateway>",
                "wan_dns1_x": "<dns1>",
                "wan_dns2_x": "<dns2>"
            }
        }
    },
    "AiMesh_Node_Mode": {
        "Operation_Mode": {
            "cfg_master": "1"
        }
    },
    "Local_Wireless_Settings": {
        "wlX_ssid": "<ssid>",
        "wlX_wpa_psk": "<password>",
        "wlX_auth_mode_x": "<open|shared|psk|psk2|sae|psk2sae>",
        "wlX_crypto": "<aes|tkip>",
        "wlX_mfp": "<0|1|2>",
        "wlX_11be": "<0|1>",
        "wlX_radio": "1",
        "wlX_timesched": "0",
        "smart_connect_x": "<0|1>",
        "mld_enable": "<0|1>"
    },
    "SDN_IoT_Guest_Network": {
        "apgX_enable": "1",
        "apgX_ssid": "<ssid>",
        "apgX_security": "<security_string>"
    },
    "AiProtection_Settings": {
        "wrs_protect_enable": "1",
        "wrs_mals_t": "0",
        "wrs_cc_t": "0",
        "wrs_vp_t": "0",
        "TM_EULA": "1"
    }
};

module.exports = qisPostNvram;