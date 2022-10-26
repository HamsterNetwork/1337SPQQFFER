var hoverSpace;

function canDrop(thing, target) {
    if (thing == target) return false;

    let temp = target;
    while (temp.parentNode) {
        temp = temp.parentNode;
        if (temp == thing) return false;
    }
    return true;
}

/**
 * Types of components
 */
var Type = {
    TRIGGER   : '触发器',
    TARGET    : '目标',
    CONDITION : '条件',
    MECHANIC  : '效果'
};
var rep_type = {
    触发器   : 'Trigger',
    目标    : 'target',
    条件 : 'condition',
    效果  : 'mechanic'
}

/**
 * Available triggers for activating skill effects
 */

var language = {
    TRIGGER: {
        'Block Break':'方块破坏',
        'Block Place':'方块放置',
        'Cast':'主动释放',
        'Cleanup':'技能清除',
        'Crouch':'下蹲',
        'Death':'死亡',
        'Drop Item':'丢出物品',
        'Environment Damage':'环境伤害',
        'Fishing':'钓鱼',
        'Fishing Bite':'鱼咬钩',
        'Fishing Fail':'钓鱼失败',
        'Fishing Grab':'钓鱼成功',
        'Fishing Ground':'鱼竿砸地',
        'Fishing Reel':'鱼竿收杆',
        'Initialize':'复活',
        'Item Swap':'物品切换',
        'Kill':'击杀',
        'Land':'落地',
        'Launch':'射击',
        'Left Click':'左键',
        'Right Click':'右键',
        'Move':'移动',
        'Physical Damage':'物理伤害',
        'Skill Damage':'技能伤害',
        'Took Physical Damage':'受到物理伤害',
        'Took Skill Damage':'受到技能伤害'
    },
    TARGET : {
        Area: '范围',
        Cone: '圆锥',
        Linear   : '直线',
        Location : '坐标',
        Nearest  : '最近',
        Offset   : '偏移',
        Remember : '记忆',
        Self     : '自身',
        Single   : '单体',
    },
    CONDITION : {
        'Altitude':'高度',
        'Armor':'盔甲',
        'Attribute':'属性',
        'Biome':'群系',
        'Block':'方块',
        'Burning':'燃烧中',
        'Ceiling':'头上空间',
        'Chance':'几率',
        'Class':'职业',
        'Class Level':'职业等级',
        'Combat':'战斗状态',
        'Crouch':'下蹲',
        'Direction':'朝向',
        'Elevation':'高度',
        'Else':'或',
        'Entity Type':'敌人类型',
        'Fire':'货源',
        'Flag':'标记',
        'Food':'食物',
        'Ground':'地面',
        'Health':'生命',
        'Inventory':'背包物品',
        'Item':'手持物品',
        'Light':'亮度',
        'Mana':'法力值',
        'Money':'金钱',
        'Mounted':'已骑乘',
        'Mounting':'正在上骑乘',
        'MythicMob Type':'神话怪物类型',
        'Name':'名字',
        'Offhand':'副手',
        'Permission':'权限',
        'Potion':'药水效果',
        'Skill Level':'技能等级',
        'Slot':'栏位',
        'Status':'状态',
        'Time':'时间',
        'Tool':'工具',
        'Value':'数值',
        'Water':'水',
        'Weather':'天气',
        'World':'世界',
    },
    MECHANIC :{
        'Armor':'盔甲',
        'Armor Stand':'盔甲架',
        'Armor Stand Pose':'盔甲架造型',
        'Attribute':'属性',
        'Block':'方块',
        'Buff':'加成',
        'Cancel':'取消',
        'Channel':'吟唱',
        'Cleanse':'净化',
        'Command':'命令',
        'Cooldown':'冷却',
        'Damage':'伤害',
        'Damage Buff':'伤害加成',
        'Damage Lore':'Lore伤害',
        'Defense Buff':'防御加成',
        'Delay':'延迟',
        'Disguise':'伪装',
        'Durability':'耐久',
        'Explosion':'爆炸',
        'Fire':'火焰',
        'Flag':'标记',
        'Flag Clear':'标记清除',
        'Flag Toggle':'标记切换',
        'Food':'食物',
        'Forget Targets':'遗忘目标',
        'Heal':'治疗',
        'Health Set':'设置生命值',
        'Held Item':'移动手持物品',
        'Immunity':'伤害免疫',
        'Interrupt':'打断',
        'Item':'物品',
        'Item Drop':'物品丢出',
        'Item Projectile':'物品弹射',
        'Item Remove':'物品删除',
        'Launch':'射击',
        'Lightning':'闪电',
        'Mana':'魔力值',
        'Message':'聊天信息',
        'Mine':'挖矿',
        'Money':'金钱',
        'Particle':'粒子',
        'Particle Animation':'粒子动画',
        'Particle Effect':'粒子效果',
        'Cancel Effect':'取消效果',
        'Particle Projectile':'粒子弹射',
        'Passive':'被动',
        'Permission':'权限',
        'Potion':'药水效果',
        'Potion Projectile':'药水弹射',
        'Projectile':'弹射',
        'Purge':'清除',
        'Push':'击退',
        'Remember Targets':'记住目标',
        'Repeat':'重复',
        'Sound':'声音',
        'Stat':'统计',
        'Status':'状态',
        'Taunt':'嘲讽',
        'Trigger':'触发器',
        'Value Add':'添加数值',
        'Value Attribute':'属性数值',
        'Value Copy':'储存数值',
        'Value Distance':'距离数值',
        'Value Health':'生命数值',
        'Value Location':'位置数值',
        'Value Lore':'Lore数值',
        'Value Lore Slot':'Lore栏位数值',
        'Value Mana':'魔力数值',
        'Value Multiply':'倍数数值',
        'Value Placeholder':'变量数值',
        'Value Random':'随机数值',
        'Value Set':'数值设置',
        'Warp':'传送',
        'Warp Location':'位置传送',
        'Warp Random':'随机传送',
        'Warp Swap':'交换传送',
        'Warp Target':'目标传送',
        'Warp Value':'数值传送',
        'Wolf':'狼',
    }
}
var Trigger = {
    BLOCK_BREAK          : { name: '方块破坏',          container: true, construct: TriggerBlockBreak,        premium: true },
    BLOCK_PLACE          : { name: '方块放置',          container: true, construct: TriggerBlockPlace,        premium: true },
    CAST                 : { name: '主动释放',                 container: true, construct: TriggerCast               },
    CLEANUP              : { name: '技能清除',              container: true, construct: TriggerCleanup            },
    CROUCH               : { name: '下蹲',               container: true, construct: TriggerCrouch             },
    DEATH                : { name: '死亡',                container: true, construct: TriggerDeath              },
    DROP_ITEM            : { name: '丢出物品',            container: true, construct: TriggerDropItem           },
    ENVIRONMENT_DAMAGE   : { name: '环境伤害',   container: true, construct: TriggerEnvironmentDamage, premium: true },
    FISH                 : { name: '钓鱼',              container: true, construct: TriggerFishing            },
    FISH_BITE            : { name: '鱼咬钩',         container: true, construct: TriggerFishingBite        },
    FISH_FAIL            : { name: '钓鱼失败',         container: true, construct: TriggerFishingFail        },
    FISH_GRAB            : { name: '钓鱼成功',         container: true, construct: TriggerFishingGrab        },
    FISH_GROUND          : { name: '鱼竿砸地',       container: true, construct: TriggerFishingGround      },
    FISH_REEL            : { name: '鱼竿收杆',         container: true, construct: TriggerFishingReel        },
    INITIALIZE           : { name: '复活',           container: true, construct: TriggerInitialize         },
    ITEMSWAP             : { name: '物品切换',            container: true, construct: TriggerItemSwap           },
    KILL                 : { name: '击杀',                 container: true, construct: TriggerKill               },
    LAND                 : { name: '落地',                 container: true, construct: TriggerLand               },
    LAUNCH               : { name: '射击',               container: true, construct: TriggerLaunch             },
    LEFT_CLICK           : { name: '左键',           container: true, construct: TriggerLeftClick          },
    RIGHT_CLICK          : { name: '右键',          container: true, construct: TriggerRightClick         },
    MOVE                 : { name: '移动',                 container: true, construct: TriggerMove               },
    PHYSICAL_DAMAGE      : { name: '物理伤害',      container: true, construct: TriggerPhysicalDamage     },
    SKILL_DAMAGE         : { name: '技能伤害',         container: true, construct: TriggerSkillDamage        },
    TOOK_PHYSICAL_DAMAGE : { name: '受到物理伤害', container: true, construct: TriggerTookPhysicalDamage },
    TOOK_SKILL_DAMAGE    : { name: '受到技能伤害',    container: true, construct: TriggerTookSkillDamage    }
};

/**
 * Available target component data
 */
var Target = {
    AREA     : { name: '范围',     container: true, construct: TargetArea     },
    CONE     : { name: '圆锥',     container: true, construct: TargetCone     },
    LINEAR   : { name: '直线',   container: true, construct: TargetLinear   },
    LOCATION : { name: '坐标', container: true, construct: TargetLocation },
    NEAREST  : { name: '最近',  container: true, construct: TargetNearest  },
    OFFSET   : { name: '偏移',   container: true, construct: TargetOffset   },
    REMEMBER : { name: '记忆', container: true, construct: TargetRemember },
    SELF     : { name: '自身',     container: true, construct: TargetSelf     },
    SINGLE   : { name: '单体',   container: true, construct: TargetSingle   }
};

/**
 * Available condition component data
 */
var Condition = {
    ALTITUDE       : { name: '高度',       container: true, construct: ConditionAltitude      },
    ARMOR          : { name: '盔甲',          container: true, construct: ConditionArmor         },
    ATTRIBUTE      : { name: '属性',      container: true, construct: ConditionAttribute     },
    BIOME          : { name: '群系',          container: true, construct: ConditionBiome         },
    BLOCK          : { name: '方块',          container: true, construct: ConditionBlock         },
    BURNING        : { name: '燃烧中',        container: true, construct: ConditionBurning       },
    CEILING        : { name: '头上空间',        container: true, construct: ConditionCeiling       },
    CHANCE         : { name: '几率',         container: true, construct: ConditionChance        },
    CLASS          : { name: '职业',          container: true, construct: ConditionClass         },
    CLASS_LEVEL    : { name: '职业等级',    container: true, construct: ConditionClassLevel    },
    COMBAT         : { name: '战斗状态',         container: true, construct: ConditionCombat        },
    CROUCH         : { name: '下蹲',         container: true, construct: ConditionCrouch        },
    DIRECTION      : { name: '朝向',      container: true, construct: ConditionDirection     },
    ELEVATION      : { name: '高度',      container: true, construct: ConditionElevation     },
    ELSE           : { name: '或',           container: true, construct: ConditionElse          },
    ENTITY_TYPE    : { name: '敌人类型',    container: true, construct: ConditionEntityType    },
    FIRE           : { name: '货源',           container: true, construct: ConditionFire          },
    FLAG           : { name: '标记',           container: true, construct: ConditionFlag          },
    FOOD           : { name: '食物',           container: true, construct: ConditionFood          },
    GROUND         : { name: '地面',         container: true, construct: ConditionGround        },
    HEALTH         : { name: '生命',         container: true, construct: ConditionHealth        },
    INVENTORY      : { name: '背包物品',      container: true, construct: ConditionInventory     },
    ITEM           : { name: '手持物品',           container: true, construct: ConditionItem          },
    LIGHT          : { name: '亮度',          container: true, construct: ConditionLight         },
    MANA           : { name: '法力值',           container: true, construct: ConditionMana          },
    MONEY          : { name: '金钱',          container: true, construct: ConditionMoney         },
    MOUNTED        : { name: '已骑乘',        container: true, construct: ConditionMounted       },
    MOUNTING       : { name: '正在上骑乘',       container: true, construct: ConditionMounting      },
    MYTHICMOB_TYPE : { name: '神话怪物类型', container: true, construct: ConditionMythicMobType },
    NAME           : { name: '名字',           container: true, construct: ConditionName          },
    OFFHAND        : { name: '副手',        container: true, construct: ConditionOffhand       },
    PERMISSION     : { name: '权限',     container: true, construct: ConditionPermission    },
    POTION         : { name: '药水效果',         container: true, construct: ConditionPotion        },
    SKILL_LEVEL    : { name: '技能等级',    container: true, construct: ConditionSkillLevel    },
    SLOT           : { name: '栏位',           container: true, construct: ConditionSlot          },
    STATUS         : { name: '状态',         container: true, construct: ConditionStatus        },
    TIME           : { name: '时间',           container: true, construct: ConditionTime          },
    TOOL           : { name: '工具',           container: true, construct: ConditionTool          },
    VALUE          : { name: '数值',          container: true, construct: ConditionValue         },
    WATER          : { name: '水',          container: true, construct: ConditionWater         },
    WEATHER        : { name: '天气',        container: true, construct: ConditionWeather       },
    WORLD          : { name: '世界',          container: true, construct: ConditionWorld         }
};

/**
 * Available mechanic component data
 */
var Mechanic = {
    ARMOR               : { name: '盔甲',               container: false, construct: MechanicArmor              },
    ARMOR_STAND         : { name: '盔甲架',         container: true,  construct: MechanicArmorStand         },
    ARMOR_STAND_POSE    : { name: '盔甲架造型',    container: false, construct: MechanicArmorStandPose     },
    ATTRIBUTE           : { name: '属性',           container: false, construct: MechanicAttribute          },
    BLOCK               : { name: '方块',               container: false, construct: MechanicBlock              },
    BUFF                : { name: '加成',                container: false, construct: MechanicBuff               },
    CANCEL              : { name: '取消',              container: false, construct: MechanicCancel             },
    CHANNEL             : { name: '吟唱',             container: true,  construct: MechanicChannel            },
    CLEANSE             : { name: '净化',             container: false, construct: MechanicCleanse            },
    COMMAND             : { name: '命令',             container: false, construct: MechanicCommand            },
    COOLDOWN            : { name: '冷却',            container: false, construct: MechanicCooldown           },
    DAMAGE              : { name: '伤害',              container: false, construct: MechanicDamage             },
    DAMAGE_BUFF         : { name: '伤害加成',         container: false, construct: MechanicDamageBuff         },
    DAMAGE_LORE         : { name: 'Lore伤害',         container: false, construct: MechanicDamageLore         },
    DEFENSE_BUFF        : { name: '防御加成',        container: false, construct: MechanicDefenseBuff        },
    DELAY               : { name: '延迟',               container: true,  construct: MechanicDelay              },
    DISGUISE            : { name: '伪装',            container: false, construct: MechanicDisguise           },
    DURABILITY          : { name: '耐久',          container: false, construct: MechanicDurability         },
    EXPLOSION           : { name: '爆炸',           container: false, construct: MechanicExplosion          },
    FIRE                : { name: '火焰',                container: false, construct: MechanicFire               },
    FLAG                : { name: '标记',                container: false, construct: MechanicFlag               },
    FLAG_CLEAR          : { name: '标记清除',          container: false, construct: MechanicFlagClear          },
    FLAG_TOGGLE         : { name: '标记切换',         container: false, construct: MechanicFlagToggle         },
    FOOD                : { name: '食物',                container: false, construct: MechanicFood               },
    FORGET_TARGETS      : { name: '遗忘目标',      container: false, construct: MechanicForgetTargets      },
    HEAL                : { name: '治疗',                container: false, construct: MechanicHeal               },
    HEALTH_SET          : { name: '设置生命值',          container: false, construct: MechanicHealthSet          },
    HELD_ITEM           : { name: '移动手持物品',           container: false, construct: MechanicHeldItem           },
    IMMUNITY            : { name: '伤害免疫',            container: false, construct: MechanicImmunity           },
    INTERRUPT           : { name: '打断',           container: false, construct: MechanicInterrupt          },
    ITEM                : { name: '物品',                container: false, construct: MechanicItem               },
    ITEM_DROP           : { name: '物品丢出',           container: false, construct: MechanicItemDrop           },
    ITEM_PROJECTILE     : { name: '物品弹射',     container: true,  construct: MechanicItemProjectile     },
    ITEM_REMOVE         : { name: '物品删除',         container: false, construct: MechanicItemRemove         },
    LAUNCH              : { name: '射击',              container: false, construct: MechanicLaunch             },
    LIGHTNING           : { name: '闪电',           container: true,  construct: MechanicLightning          },
    MANA                : { name: '魔力值',                container: false, construct: MechanicMana               },
    MESSAGE             : { name: '聊天信息',             container: false, construct: MechanicMessage            },
    MINE                : { name: '挖矿',                container: false, construct: MechanicMine               },
    MONEY               : { name: '金钱',               container: false, construct: MechanicMoney              },
    PARTICLE            : { name: '粒子',            container: false, construct: MechanicParticle           },
    PARTICLE_ANIMATION  : { name: '粒子动画',  container: false, construct: MechanicParticleAnimation  },
    PARTICLE_EFFECT     : { name: '粒子效果',     container: false, construct: MechanicParticleEffect     },
    CANCEL_EFFECT       : { name: '取消效果',       container: false, construct: MechanicCancelEffect       },
    PARTICLE_PROJECTILE : { name: '粒子弹射', container: true,  construct: MechanicParticleProjectile },
    PASSIVE             : { name: '被动',             container: true,  construct: MechanicPassive            },
    PERMISSION          : { name: '权限',          container: false, construct: MechanicPermission         },
    POTION              : { name: '药水效果',              container: false, construct: MechanicPotion             },
    POTION_PROJECTILE   : { name: '药水弹射',   container: true,  construct: MechanicPotionProjectile   },
    PROJECTILE          : { name: '弹射',          container: true,  construct: MechanicProjectile         },
    PURGE               : { name: '清除',               container: false, construct: MechanicPurge              },
    PUSH                : { name: '击退',                container: false, construct: MechanicPush               },
    REMEMBER_TARGETS    : { name: '记住目标',    container: false, construct: MechanicRememberTargets    },
    REPEAT              : { name: '重复',              container: true,  construct: MechanicRepeat             },
    SOUND               : { name: '声音',               container: false, construct: MechanicSound              },
    Stat                : { name: '统计',                container: false, construct: MechanicStat               },
    STATUS              : { name: '状态',              container: false, construct: MechanicStatus             },
    TAUNT               : { name: '嘲讽',               container: false, construct: MechanicTaunt              },
    TRIGGER             : { name: '触发器',             container: true,  construct: MechanicTrigger            },
    VALUE_ADD           : { name: '添加数值',           container: false, construct: MechanicValueAdd           },
    VALUE_ATTRIBUTE     : { name: '属性数值',     container: false, construct: MechanicValueAttribute     },
    VALUE_COPY          : { name: '储存数值',          container: false, construct: MechanicValueCopy          },
    VALUE_DISTANCE      : { name: '距离数值',      container: false, construct: MechanicValueDistance      },
    VALUE_HEALTH        : { name: '生命数值',        container: false, construct: MechanicValueHealth        },
    VALUE_LOCATION      : { name: '位置数值',      container: false, construct: MechanicValueLocation      },
    VALUE_LORE          : { name: 'Lore数值',          container: false, construct: MechanicValueLore          },
    VALUE_LORE_SLOT     : { name: 'Lore栏位数值',     container: false, construct: MechanicValueLoreSlot      },
    VALUE_MANA          : { name: '魔力数值',          container: false, construct: MechanicValueMana          },
    VALUE_MULTIPLY      : { name: '倍数数值',      container: false, construct: MechanicValueMultiply      },
    VALUE_PLACEHOLDER   : { name: '变量数值',   container: false, construct: MechanicValuePlaceholder   },
    VALUE_RANDOM        : { name: '随机数值',        container: false, construct: MechanicValueRandom        },
    VALUE_SET           : { name: '数值设置',           container: false, construct: MechanicValueSet           },
    WARP                : { name: '传送',                container: false, construct: MechanicWarp               },
    WARP_LOC            : { name: '位置传送',       container: false, construct: MechanicWarpLoc            },
    WARP_RANDOM         : { name: '随机传送',         container: false, construct: MechanicWarpRandom         },
    WARP_SWAP           : { name: '交换传送',           container: false, construct: MechanicWarpSwap           },
    WARP_TARGET         : { name: '目标传送',         container: false, construct: MechanicWarpTarget         },
    WARP_VALUE          : { name: '数值传送',          container: false, construct: MechanicWarpValue          },
    WOLF                : { name: '狼',                container: true,  construct: MechanicWolf               }
};

var saveIndex;

/**
 * Represents a component of a dynamic skill
 *
 * @param {string}    name      - name of the component
 * @param {string}    type      - type of the component
 * @param {boolean}   container - whether the component can contain others
 * @param {Component} [parent]  - parent of the component if any
 *
 * @constructor
 */
function Component(name, type, container, parent) {
    this.name       = name;
    this.type       = type;
    this.container  = container;
    this.parent     = parent;
    this.html       = undefined;
    this.components = [];
    this.data       = [new StringValue('Icon Key', 'icon-key', '').setTooltip('The key used by the component in the Icon Lore. If this is set to "example" and has a value name of "value", it can be referenced using the string "{attr:example.value}".')];
    if (this.type == Type.MECHANIC) {
        this.data.push(new ListValue('释放类型', 'counts', [ 'True', 'False' ], 'True')
            .setTooltip('True为技能释放成功时的效果,会消耗法力并开始冷却,False为技能释放失败时的效果,该项可用于技能释放失败的惩罚')
        );
    } else if (this.type == Type.TRIGGER && name != 'Cast' && name != 'Initialize' && name != 'Cleanup') {
        this.data.push(new ListValue('需要法力值', 'mana', [ 'True', 'False' ], 'False')
            .setTooltip('触发该条件是否需要消耗法力值 False为不需要')
        );
        this.data.push(new ListValue('冷却时间归零激活', 'cooldown', [ 'True', 'False' ], 'False')
            .setTooltip('触发该条件是否需要等冷却时间归零')
        );
    }

    this.dataKey      = 'data';
    this.componentKey = 'children';
}

Component.prototype.dupe = function (parent) {
    let i;
    let ele = new Component(this.name, this.type, this.container, parent);
    for (i = 0; i < this.components.length; i++) {
        ele.components.push(this.components[i].dupe(ele));
    }
    ele.data = ele.data.slice(0, 1);
    for (i = ele.data.length; i < this.data.length; i++) {
        ele.data.push(copyRequirements(this.data[i], this.data[i].dupe()));
    }
    ele.description = this.description;
    return ele;
};

/**
 * Creates the builder HTML element for the component and
 * appends it onto the target HTML element.
 *
 * @param {Element} target - the HTML element to append the result to
 */
Component.prototype.createBuilderHTML = function (target) {
    // Create the wrapping divs with the appropriate classes
    let container  = document.createElement('div');
    container.comp = this;
    if (this.type == Type.TRIGGER) {
        container.className = 'componentWrapper';
    }

    let div       = document.createElement('div');
    div.className = 'component ' + this.type;
    if (this.type != Type.TRIGGER) {
        div.draggable   = true;
        div.ondragstart = this.drag;
    }
    div.ondrop = this.drop;
    if (this.container) {
        div.ondragover = this.allowDrop;
    }

    // Component label
    let label       = document.createElement('h3');
    label.title     = '编辑 ' + this.name + ' 设置';
    label.className = this.type + 'Label';
    label.innerHTML = this.name;
    label.component = this;
    label.addEventListener('click', function (e) {
        this.component.createFormHTML();
        showSkillPage('skillForm');
    });
    div.appendChild(label);

    // Container components can add children so they get a button
    if (this.container) {
        let add       = document.createElement('div');
        add.className = 'builderButton';
        add.innerHTML = '+ 添加子类';
        add.component = this;
        add.addEventListener('click', function (e) {
            activeComponent = this.component;
            showSkillPage('componentChooser');
        });
        div.appendChild(add);

        let vision              = document.createElement('div');
        vision.title            = '隐藏子类';
        vision.className        = 'builderButton smallButton';
        vision.style.background = 'url("editor/img/eye.png") no-repeat center #222';
        vision.component        = this;
        vision.addEventListener('click', function (e) {
            let comp = this.component;
            if (comp.childrenHidden) {
                comp.childDiv.style.display = 'block';
                this.style.backgroundImage  = 'url("editor/img/eye.png")';
            } else {
                comp.childDiv.style.display = 'none';
                this.style.backgroundImage  = 'url("editor/img/eyeShaded.png")';
            }
            comp.childrenHidden = !comp.childrenHidden;
        });
        div.appendChild(vision);
        this.childrenHidden = false;
    }

    // Add the duplicate button
    if (this.type != Type.TRIGGER) {
        let duplicate              = document.createElement('div');
        duplicate.className        = 'builderButton smallButton';
        duplicate.title            = '复制';
        duplicate.style.background = 'url("editor/img/duplicate.png") no-repeat center #222';
        duplicate.component        = this;
        duplicate.addEventListener('click', function (e) {
            let comp = this.component;
            let copy = comp.dupe(comp.parent);
            comp.parent.components.push(copy);
            copy.createBuilderHTML(comp.parent.html);
        });
        div.appendChild(duplicate);
    }

    // Add the remove button
    let remove              = document.createElement('div');
    remove.title            = '删除';
    remove.className        = 'builderButton smallButton cancelButton';
    remove.style.background = 'url("editor/img/delete.png") no-repeat center #f00';
    remove.component        = this;
    remove.addEventListener('click', function (e) {
        let list = this.component.parent.components;
        for (let i = 0; i < list.length; i++) {
            if (list[i] == this.component) {
                list.splice(i, 1);
                break;
            }
        }
        this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
    });
    div.appendChild(remove);

    container.appendChild(div);

    // Apply child components
    let childContainer       = document.createElement('div');
    childContainer.className = 'componentChildren';
    if (this.components.length > 0) {
        for (let i = 0; i < this.components.length; i++) {
            this.components[i].createBuilderHTML(childContainer);
        }
    }
    container.appendChild(childContainer);
    this.childDiv = childContainer;

    // Append the content
    target.appendChild(container);

    this.html = childContainer;
};

Component.prototype.allowDrop = function (e) {
    e.preventDefault();
    if (hoverSpace) {
        hoverSpace.style.marginBottom = '0px';
        hoverSpace.onmouseout         = undefined;
    }
    hoverSpace = e.target;
    while (hoverSpace.className.indexOf('component') < 0) {
        hoverSpace = hoverSpace.parentNode;
    }
    let thing = document.getElementById('dragComponent');
    if (hoverSpace.id != 'dragComponent' && hoverSpace.parentNode.comp.container && canDrop(thing, hoverSpace)) {
        hoverSpace.style.marginBottom = '30px';
        hoverSpace.onmouseout         = function () {
            if (!hoverSpace) {
                this.onmouseout = undefined;
                return;
            }
            hoverSpace.style.marginBottom = '0px';
            hoverSpace.onmouseout         = undefined;
            hoverSpace                    = undefined;
        }
    } else hoverSpace = undefined;
};

Component.prototype.drag = function (e) {
    e.dataTransfer.setData('text', 'anything');
    let dragged = document.getElementById('dragComponent');
    if (dragged) {
        dragged.id = '';
    }
    e.target.id = 'dragComponent';
};

Component.prototype.drop = function (e) {
    if (hoverSpace) {
        hoverSpace.style.marginBottom = '0px';
        hoverSpace                    = undefined;
    }

    e.preventDefault();
    let thing  = document.getElementById('dragComponent').parentNode;
    let target = e.target;
    while (target.className.indexOf('component') < 0) {
        target = target.parentNode;
    }
    if (target.id == 'dragComponent' || !target.parentNode.comp.container || !canDrop(thing, target)) {
        return;
    }
    let targetComp = target.parentNode.comp;
    let thingComp  = thing.comp;
    target         = target.parentNode.childNodes[1];
    thing.parentNode.removeChild(thing);
    target.appendChild(thing);

    thingComp.parent.components.splice(thingComp.parent.components.indexOf(thingComp), 1);
    thingComp.parent = targetComp;
    thingComp.parent.components.push(thingComp);
};

/**
 * Creates the form HTML for editing the component data and
 * applies it to the appropriate part of the page.
 */
Component.prototype.createFormHTML = function () {
    let target = document.getElementById('skillForm');

    let form = document.createElement('form');

    let header       = document.createElement('h4');
    header.innerHTML = this.name;
    form.appendChild(header);

    if (this.description) {
        let desc       = document.createElement('p');
        desc.innerHTML = this.description;
        form.appendChild(desc);
    }

    if (this.data.length > 1) {
        let h = document.createElement('hr');
        form.appendChild(h);

        let i = 1;
        for (let j = 1; j < this.data.length; j++) {
            if (this.data[j] instanceof AttributeValue) {
                i = 0;
                break;
            }
        }
        for (; i < this.data.length; i++) {
            this.data[i].hidden = false;
            this.data[i].createHTML(form);
        }
    }

    let hr = document.createElement('hr');
    form.appendChild(hr);

    let done       = document.createElement('h5');
    done.className = 'doneButton';
    done.innerHTML = '确定';
    done.component = this;
    done.addEventListener('click', function (e) {
        this.component.update();
        document.getElementById('skillForm').removeChild(this.component.form);
        showSkillPage('builder');
    });
    form.appendChild(done);

    this.form = form;

    target.innerHTML = '';
    target.appendChild(form);
    activeComponent = this;

    for (let i = 0; i < this.data.length; i++) {
        this.data[i].applyRequireValues();
    }
}

/**
 * Updates the component using the form data if it exists
 */
Component.prototype.update = function () {
    for (let j = 0; j < this.data.length; j++) {
        this.data[j].update();
    }
};

/**
 * Gets the save string for the component
 *
 * @param {string} spacing - spacing to put before the data
 */
Component.prototype.getSaveString = function (spacing) {
    this.createFormHTML();

    let id    = '';
    let index = saveIndex;
    while (index > 0 || id.length == 0) {
        id += String.fromCharCode((index % 26) + 97);
        index = Math.floor(index / 26);
    }
    let result = spacing + this.name + '-' + id + ":\n";
    saveIndex++;

    result += spacing + "  type: '" + rep_type[this.type] + "'\n";
    if (this.data.length > 0) {
        result += spacing + '  data:\n';
        for (let i = 0; i < this.data.length; i++) {
            if (!this.data[i].hidden)
                result += this.data[i].getSaveString(spacing + '    ');
        }
    }
    if (this.components.length > 0) {
        result += spacing + '  children:\n';
        for (let j = 0; j < this.components.length; j++) {
            result += this.components[j].getSaveString(spacing + '    ');
        }
    }
    return result;
};

/**
 * Loads component data from the config lines stating at the given index
 *
 * @param {YAMLObject} data - the data to load
 *
 * @returns {Number} the index of the last line of data for this component
 */
Component.prototype.load = loadSection;

// -- Custom constructor ------------------------------------------------------- //

extend('CustomComponent', 'Component');

function CustomComponent(data) {
    this.super(data.display, data.type.toLowerCase(), data.container);
    this.description = data.description;

    for (let i = 0; i < data.options.length; i++) {
        let option = data.options[i];
        switch (option.type) {
            case 'NUMBER':
                this.data.push(new AttributeValue(option.display, option.key, option.base, option.scale)
                    .setTooltip(option.description)
                );
                break;
            case 'TEXT':
                this.data.push(new StringValue(option.display, option.key, option.default)
                    .setTooltip(option.description)
                );
                break;
            case 'DROPDOWN':
                this.data.push(new ListValue(option.display, option.key, option.options, option.options[0])
                    .setTooltip(option.description)
                );
                break;
            case 'LIST':
                this.data.push(new MultiListValue(option.display, option.key, option.options, [])
                    .setTooltip(option.description)
                );
                break;
            default:
                throw new Error("Invalid component with key " + data.key);
        }
    }
}

// -- Trigger constructors ----------------------------------------------------- //

extend('TriggerBlockBreak', 'Component');

function TriggerBlockBreak() {
    this.super('方块破坏', Type.TRIGGER, true);
    this.description = '当玩家破坏指定信息的方块时触发';

    this.data.push(new MultiListValue('方块类型', 'material', getAnyMaterials, [ 'Any' ])
        .setTooltip('希望被破坏的方块的类型')
    );
    this.data.push(new IntValue('数量', 'data', -1)
        .setTooltip('需要破坏的方块数量(-1为破坏多少都可以)')
    );
}

extend('TriggerBlockPlace', 'Component');

function TriggerBlockPlace() {
    this.super('方块放置', Type.TRIGGER, true);
    this.description = '当玩家放置指定信息的方块时触发';

    this.data.push(new MultiListValue('方块类型', 'material', getAnyMaterials, [ 'Any' ])
        .setTooltip('希望被放置的方块的类型')
    );
    this.data.push(new IntValue('数量', 'data', -1)
        .setTooltip('需要放置的方块数量(-1为放置多少都可以)')
    );
}

extend('TriggerCast', 'Component');

function TriggerCast() {
    this.super('主动释放', Type.TRIGGER, true);

    this.description = '使用技能栏/组合键/指令来触发技能';
}

extend('TriggerCleanup', 'Component');

function TriggerCleanup() {
    this.super('技能清除', Type.TRIGGER, true);

    this.description = '当玩家遗忘或删除技能时触发,通常用于限定技';
}

extend('TriggerCrouch', 'Component');

function TriggerCrouch() {
    this.super('下蹲', Type.TRIGGER, true);

    this.description = '当玩家按下或松开下蹲键(shift)触发技能';

    this.data.push(new ListValue('类型', 'type', [ 'Start Crouching', 'Stop Crouching', 'Both' ], 'Start Crouching')
        .setTooltip('分别为 按下/松开/两者')
    );
}

extend('TriggerDeath', 'Component');

function TriggerDeath() {
    this.super('Death', Type.TRIGGER, true);

    this.description = '玩家死亡时触发技能';
}

extend('TriggerDropItem', 'Component');

function TriggerDropItem() {
    this.super('丢出物品', Type.TRIGGER, true);

    this.description = '在丢出物品时触发技能';

    this.data.push(new ListValue('丢出多个', 'drop multiple', ['True', 'False', 'Ignore'], 'Ignore')
        .setTooltip('玩家需要丢出多个道具还是单个道具')
    );
}

extend('TriggerEnvironmentDamage', 'Component');

function TriggerEnvironmentDamage() {
    this.super('环境伤害', Type.TRIGGER, true);

    this.description = '当玩家受到指定种类的环境伤害时触发技能';

    this.data.push(new ListValue('种类', 'type', DAMAGE_TYPES, 'FALL')
        .setTooltip('伤害的种类')
    );
}

extend('TriggerFishing', 'Component');

function TriggerFishing() {
    this.super('钓鱼', Type.TRIGGER, true);

    this.description = '在用鱼竿右键点击时触发技能';
}

extend('TriggerFishingBite', 'Component');

function TriggerFishingBite() {
    this.super('鱼咬钩', Type.TRIGGER, true);

    this.description = '当鱼咬到玩家的鱼竿时触发技能';
}

extend('TriggerFishingFail', 'Component');

function TriggerFishingFail() {
    this.super('钓鱼失败', Type.TRIGGER, true);

    this.description = '当玩家因时机不佳而未能钓到鱼时触发技能';
}

extend('TriggerFishingGrab', 'Component');

function TriggerFishingGrab() {
    this.super('钓鱼成功', Type.TRIGGER, true);

    this.description = '当玩家钓到鱼时触发技能';
}

extend('TriggerFishingGround', 'Component');

function TriggerFishingGround() {
    this.super('鱼竿砸地', Type.TRIGGER, true);

    this.description = '当钓鱼竿的鱼钩击中地面时触发技能';
}

extend('TriggerFishingReel', 'Component');

function TriggerFishingReel() {
    this.super('鱼竿收杆', Type.TRIGGER, true);

    this.description = '当玩家在鱼竿上没有鱼的情况下将鱼竿从水中或空气中卷出时触发技能';
}

extend('TriggerInitialize', 'Component');

function TriggerInitialize() {
    this.super('Initialize', Type.TRIGGER, true);

    this.description = '玩家复活时触发技能,可以用来做被动技能';
}

extend('TriggerItemSwap', 'Component');

function TriggerItemSwap() {
    this.super('物品切换', Type.TRIGGER, true);

    this.description = '在按下键盘上的切换键时触发技能';

    this.data.push(new ListValue('权限切换', 'cancel', ['True', 'False'], 'True')
        .setTooltip('True取消物品切换，False允许切换物品'));
}

extend('TriggerKill', 'Component');

function TriggerKill() {
    this.super('Kill', Type.TRIGGER, true);

    this.description = '击杀实体时触发技能';
}

extend('TriggerLand', 'Component');

function TriggerLand() {
    this.super('落地', Type.TRIGGER, true);

    this.description = '玩家落地时触发技能';

    this.data.push(new DoubleValue('最小距离', 'min-distance', 0)
        .setTooltip('距离地面的最小距离')
    );
}

extend('TriggerLaunch', 'Component');

function TriggerLaunch() {
    this.super('Launch', Type.TRIGGER, true);

    this.description = '玩家射击/投掷指定物品时触发技能';

    this.data.push(new ListValue('类型', 'type', [ 'Any', 'Arrow', 'Egg', 'Ender Pearl', 'Fireball', 'Fishing Hook', 'Snowball' ], 'Any')
        .setTooltip('分别为 任何东西 弓箭 蛋 末影珍珠 火球 鱼钩 雪球')
    );
}

extend('TriggerLeftClick', 'Component');

function TriggerLeftClick() {
    this.super('左键', Type.TRIGGER, true);

    this.description = '在执行左键单击时触发技能';

    this.data.push(new ListValue('下蹲', 'crouch', ['Crouch', 'Dont crouch', 'Both'], 'Crouch')
        .setTooltip('如果玩家必须蹲着才能让这个触发器发挥作用')
    );
}

extend('TriggerMove', 'Component');

function TriggerMove() {
    this.super('移动', Type.TRIGGER, true);

    this.description = '当玩家移动时触发技能。这将触发玩家移动的每一个tick，所以要慎用。使用“api moved”值来检查/使用移动的距离';
}

extend('TriggerPhysicalDamage', 'Component');

function TriggerPhysicalDamage() {
    this.super('物理伤害', Type.TRIGGER, true);

    this.description = '当玩家造成物理伤害(即非技能伤害)时触发.包括近战攻击和火焰伤害';

    this.data.push(new ListValue('目标指向', 'target', [ 'True', 'False' ], 'True')
        .setTooltip('True 使目标指向玩家. False 使目标指向受到伤害的实体')
    );
    this.data.push(new ListValue('类型', 'type', [ 'Both', 'Melee', 'Projectile' ], 'Both')
        .setTooltip('分别为 两者 近战 远程')
    );
    this.data.push(new DoubleValue("最小伤害", "dmg-min", 0)
        .setTooltip('当造成的伤害大于最小伤害就触发技能')
    );
    this.data.push(new DoubleValue("最大伤害", "dmg-max", 999)
        .setTooltip('当造成的伤害大于最大伤害就取消技能,两者配合以确定一个伤害区间')
    );
}

extend('TriggerRightClick', 'Component');

function TriggerRightClick() {
    this.super('右键', Type.TRIGGER, true);

    this.description = '在执行右键时触发技能(注意:在空中点击时，你必须有一个物品在手)';

    this.data.push(new ListValue('蹲下', 'crouch', ['Crouch', 'Dont crouch', 'Both'], 'Crouch')
        .setTooltip('如果玩家必须蹲着才能让这个触发器发挥作用')
    );
}

extend('TriggerSkillDamage', 'Component');

function TriggerSkillDamage() {
    this.super('技能伤害', Type.TRIGGER, true);

    this.description = '当玩家造成技能伤害时触发';

    this.data.push(new ListValue('目标指向', 'target', [ 'True', 'False' ], 'True')
        .setTooltip('True 使目标指向玩家. False 使目标指向受到伤害的实体')
    );
    this.data.push(new DoubleValue("最小伤害", "dmg-min", 0)
        .setTooltip('当造成的伤害大于最小伤害就触发技能')
    );
    this.data.push(new DoubleValue("最大伤害", "dmg-max", 999)
        .setTooltip('当造成的伤害大于最大伤害就取消技能,两者配合以确定一个伤害区间')
    );
    this.data.push(new StringListValue('类型', 'category', [ 'default' ] )
        .setTooltip('技能伤害的类型,不填以应用于所有技能伤害')
    );
}

extend('TriggerTookPhysicalDamage', 'Component');

function TriggerTookPhysicalDamage() {
    this.super('受到物理伤害', Type.TRIGGER, true);

    this.description = '当玩家受到物理伤害(即非技能伤害)时触发.包括近战攻击和火焰伤害';

    this.data.push(new ListValue('目标指向', 'target', [ 'True', 'False' ], 'True')
        .setTooltip('True 使目标指向玩家. False 使目标指向攻击者')
    );
    this.data.push(new ListValue('类型', 'type', [ 'Both', 'Melee', 'Projectile' ], 'Both')
        .setTooltip('分别为 两者 近战 远程')
    );
    this.data.push(new DoubleValue("最小伤害", "dmg-min", 0)
        .setTooltip('当受到的伤害大于最小伤害就触发技能')
    );
    this.data.push(new DoubleValue("最大伤害", "dmg-max", 999)
        .setTooltip('当受到的伤害大于最大伤害就取消技能,两者配合以确定一个伤害区间')
    );
}

extend('TriggerTookSkillDamage', 'Component');

function TriggerTookSkillDamage() {
    this.super('受到技能伤害', Type.TRIGGER, true);

    this.description = '当玩家受到技能伤害时触发，包括对自己的伤害';

    this.data.push(new ListValue('目标指向', 'target', [ 'True', 'False' ], 'True')
        .setTooltip('True 使目标指向玩家. False 使目标指向攻击者')
    );
    this.data.push(new DoubleValue("最小伤害", "dmg-min", 0)
        .setTooltip('当受到的伤害大于最小伤害就触发技能')
    );
    this.data.push(new DoubleValue("最大伤害", "dmg-max", 999)
        .setTooltip('当受到的伤害大于最大伤害就取消技能,两者配合以确定一个伤害区间')
    );
    this.data.push(new StringListValue('类型', 'category', [ 'default' ] )
        .setTooltip('技能伤害的类型,不填以应用于所有技能伤害')
    );
}

// -- Target constructors ------------------------------------------------------ //

extend('TargetArea', 'Component');

function TargetArea() {
    this.super('范围', Type.TARGET, true);

    this.description = '将目标指向指定半径内的所有实体';

    this.data.push(new AttributeValue("半径", "radius", 3, 0)
        .setTooltip('范围的半径,单位为方块')
    );
	addTargetOptions(this);
    this.data.push(new ListValue("随机", "random", [ 'True', 'False' ], 'False')
        .setTooltip('是否随机选取目标 False为不随机')
    );
}

extend('TargetCone', 'Component');

function TargetCone() {
    this.super('圆锥', Type.TARGET, true);

    this.description = '将目标指向施法者前面的一行中的所有实体(圆锥形).';

    this.data.push(new AttributeValue("距离", "range", 5, 0)
        .setTooltip('最大距离,单位为方块')
    );
    this.data.push(new AttributeValue("角度", "angle", 90, 0)
        .setTooltip('圆锥弧线角度')
    );
	addTargetOptions(this);
}

extend('TargetLinear', 'Component');

function TargetLinear() {
    this.super('直线', Type.TARGET, true);

    this.description = '将目标指向施法者前面的一行中的所有实体(直线)';

    this.data.push(new AttributeValue("距离", "range", 5, 0)
        .setTooltip('最大距离,单位为方块')
    );
    this.data.push(new AttributeValue("宽度", "tolerance", 4, 0)
        .setTooltip('直线的宽度,单位为方块,越宽越容易被指向')
    );
	addTargetOptions(this);
}

extend('TargetLocation', 'Component');

function TargetLocation() {
    this.super('Location', Type.TARGET, true);

    this.description = '目标指向玩家十字准星所在位置. 将另一种目标选取与此结合以实现远程区域效果(与"范围"结合类似火男的W)';

    this.data.push(new AttributeValue('距离', 'range', 5, 0)
        .setTooltip('最大距离,单位为方块')
    );
    this.data.push(new ListValue('实体', 'entities', ['True', 'False'], 'True')
        .setTooltip('为True计算实体，为False通过实体')
    );
    this.data.push(new ListValue('液体', 'fluids', ['True', 'False'], 'False')
        .setTooltip('为True计算流体(水和熔岩)，为False通过流体')
    );
    this.data.push(new ListValue('不完整方块', 'passable', ['True', 'False'], 'True')
        .setTooltip('True计算不完整的方块(草、树苗等)，False表示通过')
    );
    this.data.push(new ListValue('中心', 'center', ['True', 'False'], 'False')
        .setTooltip('是否将命中位置为中心')
    );
}

extend('TargetNearest', 'Component');

function TargetNearest() {
    this.super('最近', Type.TARGET, true);

    this.description = '以施法者为中心，指向最近的实体';

    this.data.push(new AttributeValue("半径", "radius", 3, 0)
        .setTooltip('范围的半径,单位为方块')
    );
	addTargetOptions(this);
}

extend('TargetOffset', 'Component');

function TargetOffset() {
    this.super('偏移', Type.TARGET, true);

    this.description = '对目标选取的范围进行指定的偏移(需要之前就有一个"目标选取")并重新指向偏移后的范围';

    this.data.push(new SectionMarker('偏移'));

    this.data.push(new AttributeValue('向前', 'forward', 0, 0)
        .setTooltip('目标前方(面向)的偏移量,负数为向后偏移')
    );
    this.data.push(new AttributeValue('向上', 'upward', 2, 0.5)
        .setTooltip('目标上方的偏移量,负数为向下偏移')
    );
    this.data.push(new AttributeValue('向右', 'right', 0, 0)
        .setTooltip('目标右方的偏移量,负数为向右偏移')
    );
}

extend('TargetRemember', 'Component');

function TargetRemember() {
    this.super('记忆', Type.TARGET, true);

    this.description = '指向被记忆目标,使用"Remember Targets"(标记目标)效果来记忆目标,没有记忆目标则释放失败';

    this.data.push(new StringValue('记忆名称', 'key', 'target')
        .setTooltip('记忆的名称,不可重复')
    );
}

extend('TargetSelf', 'Component');

function TargetSelf() {
    this.super('自身', Type.TARGET, true);

    this.description = '指向自己';
}

extend('TargetSingle', 'Component');

function TargetSingle() {
    this.super('个体', Type.TARGET, true);

    this.description = '指向在施法者前面的一个单位';

    this.data.push(new AttributeValue("距离", "range", 5, 0)
        .setTooltip('最大距离,单位为方块')
    );
    this.data.push(new AttributeValue("宽度", "tolerance", 4, 0)
        .setTooltip('宽度,单位为方块,越宽越容易被指向')
    );
    this.data.push(new ListValue("群组", "group", ["Ally", "Enemy", "Both"], "Enemy")
        .setTooltip('攻击范围内的实体群组 分别为：盟友 敌人 两者')
    );
    this.data.push(new ListValue("穿墙", "wall", ['True', 'False'], 'False')
        .setTooltip('是否允许技能穿过墙壁寻找目标 False为不允许')
    );
}

// -- Condition constructors --------------------------------------------------- //

extend('ConditionAltitude', 'Component');

function ConditionAltitude()
{
    this.super('高度', Type.CONDITION, true);

    this.description = "目标处于特定高度";

    this.data.push(new AttributeValue('最小值', 'min', 0, 0)
        .setTooltip('属性不能低于最小值')
    );
    this.data.push(new AttributeValue('最大值', 'max', 999, 0)
        .setTooltip('属性不能高于最大值')
    );

}

extend('ConditionArmor', 'Component');

function ConditionArmor() {
    this.super('盔甲', Type.CONDITION, true);
    this.description = "目标穿着匹配的盔甲";

    this.data.push(new ListValue('护甲槽', 'armor', [ 'Helmet', 'Chestplate', 'Leggings', 'Boots', 'Any' ], 'Any')
        .setTooltip('指定的槽位,分别为头盔 胸甲 护腿 靴子 任意')
    );

    addItemConditionOptions(this);
}

extend('ConditionAttribute', 'Component');

function ConditionAttribute() {
    this.super('Attribute', Type.CONDITION, true);

    this.description = '目标需要拥有指定属性的指定值';

    this.data.push(new StringValue('属性', 'attribute', 'Vitality')
        .setTooltip('指定的属性名称')
    );
    this.data.push(new AttributeValue('最小值', 'min', 0, 0)
        .setTooltip('属性不能低于最小值')
    );
    this.data.push(new AttributeValue('最大值', 'max', 999, 0)
        .setTooltip('属性不能高于最大值')
    );
}

extend('ConditionBiome', 'Component');

function ConditionBiome() {
    this.super('生物群系', Type.CONDITION, true);

    this.description = '目标需要在(或不在)指定的生物群系';

    this.data.push(new ListValue('类型', 'type', [ 'In Biome', 'Not In Biome' ], 'In Biome')
        .setTooltip('分别为:在指定生物群系中 不在指定生物群系中')
    );
    this.data.push(new MultiListValue('生物群系', 'biome', getBiomes, [ 'Forest' ])
            .setTooltip('指定的生物群系')
    );
}

extend('ConditionBlock', 'Component');

function ConditionBlock() {
    this.super('方块', Type.CONDITION, true);

    this.description = '目标需要以指定方式接触指定方块';

    this.data.push(new ListValue('方式', 'standing', [ 'On Block', 'Not On Block', 'In Block', 'Not In Block' ], 'On Block')
        .setTooltip('分别为 在方块上 不在方块上 在方块里 不在方块里 在/不在方块上检测的是脚下的方块 在/不在方块里检测的是脚所在位置的方块')
    );
    this.data.push(new ListValue('类型', 'material', getMaterials, 'Dirt')
        .setTooltip('方块的类型')
    );
}

extend('ConditionBurning', 'Component');

function ConditionBurning() 
{
    this.super('燃烧', Type.CONDITION, true);

    this.description = '施法者是否正在燃烧';

    this.data.push(new ListValue('Type', 'burn', ['Burn', 'Dont burn'], 'Burn')
        .setTooltip('指定玩家是否必须处于燃烧状态才能执行此技能')
        );
}

extend('ConditionCeiling', 'Component');

function ConditionCeiling() {
    this.super('头上空间', Type.CONDITION, true);

    this.description = '目标需要与头上空间保持指定距离';

    this.data.push(new AttributeValue('距离', 'distance', 5, 0)
        .setTooltip('保持的距离,单位为方块')
    );
    this.data.push(new ListValue('高于或低于', 'at-least', [ 'True', 'False' ], 'True')
        .setTooltip('True表示必须高于指定距离 False表示必须低于指定距离')
    );
}

extend('ConditionChance', 'Component');

function ConditionChance() {
    this.super('几率', Type.CONDITION, true);

    this.description = '有几率释放技能';

    this.data.push(new AttributeValue('几率', 'chance', 25, 0)
        .setTooltip('技能释放的几率 "25" 表示几率为25%')
    );
}

extend('ConditionClass', 'Component');

function ConditionClass() {
    this.super('职业', Type.CONDITION, true);

    this.description = '目标需要为指定职业';

    this.data.push(new StringValue('职业', 'class', 'Fighter')
        .setTooltip('所需要的职业')
    );
    this.data.push(new ListValue('精确', 'exact', [ 'True', 'False' ], 'False')
        .setTooltip('是否需要精确的职业,False为不需要,代表曾经为该职业也算,True代表当前必须是该职业')
    );
}

extend('ConditionClassLevel', 'Component');

function ConditionClassLevel() {
    this.super('职业等级', Type.CONDITION, true);

    this.description = '施法者职业等级需要在指定范围内';

    this.data.push(new IntValue('最小等级', 'min-level', 2)
        .setTooltip('职业等级需要高于最小等级,如果有多个职业,则取决于主职业')
    );
    this.data.push(new IntValue('最大等级', 'max-level', 99)
        .setTooltip('职业等级需要低于于最大等级,如果有多个职业,则取决于主职业')
    );
}

extend('ConditionCombat', 'Component');

function ConditionCombat() {
    this.super('战斗状态', Type.CONDITION, true);

    this.description = '目标需要在指定战斗状态保持指定时间';

    this.data.push(new ListValue('战斗状态', 'combat', [ 'True', 'False' ], 'True')
        .setTooltip('True表示在战斗状态,False表示脱离战斗状态')
    );
    this.data.push(new DoubleValue('时间', 'seconds', 10)
        .setTooltip('距离上个战斗状态的时间')
    );
}

extend('ConditionCrouch', 'Component');

function ConditionCrouch() {
    this.super('下蹲', Type.CONDITION, true);

    this.description = '目标需要在(或不在)下蹲状态';

    this.data.push(new ListValue('在下蹲', 'crouch', [ 'True', 'False' ], 'True')
        .setTooltip('True表示需要目标在下蹲状态,False表示需要目标不在下蹲状态')
    );
}

extend('ConditionDirection', 'Component');

function ConditionDirection() {
    this.super('朝向', Type.CONDITION, true);

    this.description = '当施法者或目标需要朝向(或不朝)对方';

    this.data.push(new ListValue('类型', 'type', [ 'Target', 'Caster' ], 'Target')
        .setTooltip('选择施法者或目标,Target为目标,Caster为施法者')
    );
    this.data.push(new ListValue('方向', 'direction', [ 'Away', 'Towards' ], 'Away')
        .setTooltip('施法者或目标需要的朝向,Away为不朝向,Towards为朝向')
    );
}

extend('ConditionElevation', 'Component');

function ConditionElevation() {
    this.super('高度', Type.CONDITION, true);

    this.description = '目标需要到达指定高度';

    this.data.push(new ListValue('类型', 'type', [ 'Normal', 'Difference' ], 'Normal')
        .setTooltip('Normal代表目标的高度需要到达指定区域,Difference代表目标与施法者的高度差需要到达指定区域')
    );
    this.data.push(new AttributeValue('最小值', 'min-value', 0, 0)
        .setTooltip('Normal类型下,目标高度需要大于最小值. Difference类型下,正值代表目标需要至少高于施法者指定距离')
    );
    this.data.push(new AttributeValue('最大值', 'max-value', 255, 0)
        .setTooltip('Normal类型下,目标高度需要小于最大值. Difference类型下,负值代表目标至多低于施法者指定距离')
    );
}

extend('ConditionElse', 'Component');

function ConditionElse() {
    this.super('或', Type.CONDITION, true);

    this.description = '如果上一个触发条件没满足,则检查下一个触发条件,需要在这个的下面再填写一个触发条件,如果上一个条件满足,则跳过下面的触发条件.这不仅适用于条件未满足,还用于由于没有目标或其他情况而导致的技能释放失败';
}

extend('ConditionEntityType', 'Component');

function ConditionEntityType() {
    this.super('实体类型', Type.CONDITION, true);

    this.description = '需要目标与指定的实体类型相同'

    this.data.push(new MultiListValue('类型', 'types', getEntities)
        .setTooltip('指定的实体类型')
    );
}

extend('ConditionFire', 'Component');

function ConditionFire() {
    this.super('燃烧', Type.CONDITION, true);

    this.description = '需要目标在(或不在)燃烧';

    this.data.push(new ListValue('类型', 'type', [ 'On Fire', 'Not On Fire' ], 'On Fire')
        .setTooltip('分别为 在燃烧 不在燃烧 ')
    );
}

extend('ConditionFlag', 'Component');

function ConditionFlag() {
    this.super('标记', Type.CONDITION, true);

    this.description = '需要目标被(或不被)标记(与"选取目标"中的"记忆"区别在于,"记忆"是永久的,而"标记"可以设置持续时间,并且二者用于不同的位置)';

    this.data.push(new ListValue('类型', 'type', [ 'Set', 'Not Set' ], 'Set')
        .setTooltip('分别为 被标记 不被标记')
    );
    this.data.push(new StringValue('标记名称', 'key', 'key')
        .setTooltip('标记的名称')
    );
}

extend('ConditionFood', 'Component');

function ConditionFood() {
    this.super('食物', Type.CONDITION, true);

    this.description = "目标的食物级别与设置匹配";

    this.data.push(new ListValue('类型', 'type', ['Food', 'Percent', 'Difference', 'Difference Percent'], 'Food')
        .setTooltip('The type of measurement to use for the food. Food level is their flat food left. Percent is the percentage of food they have left. Difference is the difference between the target\'s flat food and the caster\'s. Difference percent is the difference between the target\'s percentage food left and the caster\s')
    );
    this.data.push(new AttributeValue('Min Value', 'min-value', 0, 0)
        .setTooltip('The minimum food required. A positive minimum with one of the "Difference" types would be for when the target has more food')
    );
    this.data.push(new AttributeValue('Max Value', 'max-value', 10, 2)
        .setTooltip('The maximum food required. A negative maximum with one of the "Difference" types would be for when the target has less food')
    );
}

extend('ConditionGround', 'Component');

function ConditionGround() {
    this.super('地面', Type.CONDITION, true);

    this.description = '需要目标在(或不在)地面上';

    this.data.push(new ListValue('类型', 'type', [ 'On Ground', 'Not On Ground' ], 'On Ground')
        .setTooltip('分别为 在地面 不在地面')
    );
}

extend('ConditionHealth', 'Component');

function ConditionHealth() {
    this.super('生命', Type.CONDITION, true);

    this.description = "需要目标血量在指定范围内";

    this.data.push(new ListValue('类型', 'type', [ 'Health', 'Percent', 'Difference', 'Difference Percent' ], 'Health')
        .setTooltip('分别为 血量 血量百分比(自带百分号) 与施法者血量的差距 与施法者血量的差距的百分比')
    );
    this.data.push(new AttributeValue('最小值', 'min-value', 0, 0)
        .setTooltip('目标血量或血量百分比需要高于最小值,Difference类型下,正值代表目标血量需要至少高于施法者指定数值')
    );
    this.data.push(new AttributeValue('Max Value', 'max-value', 10, 2)
        .setTooltip('目标血量或血量百分比需要低于最大值,Difference类型下,负值代表目标血量需要至多低于施法者指定数值')
    );
}

extend('ConditionItem', 'Component');

function ConditionItem() {
    this.super('物品', Type.CONDITION, true);
    this.description = "Applies child components when the target is wielding an item matching the given material.";

    addItemConditionOptions(this);
}

extend('ConditionInventory', 'Component');

function ConditionInventory() {
    this.super('背包物品', Type.CONDITION, true);

    this.description = '目标背包的指定区域需要有指定物品(对怪物无效)';

    this.data.push(new AttributeValue('数量', 'amount', 1, 0)
        .setTooltip('物品所需要的数量')
    );

    addItemConditionOptions(this);
}

extend('ConditionLight', 'Component');

function ConditionLight() {
    this.super('亮度', Type.CONDITION, true);

    this.description = "需要目标位置的亮度到达指定数值";

    this.data.push(new AttributeValue('最小亮度', 'min-light', 0, 0)
        .setTooltip('目标位置的亮度需要大于最小亮度,16表示最亮,0表示最暗')
    );
    this.data.push(new AttributeValue('最大亮度', 'max-light', 16, 16)
        .setTooltip('目标位置的亮度需要小于最大亮度,16表示最亮,0表示最暗')
    );
}

extend('ConditionMana', 'Component');

function ConditionMana() {
    this.super('法力值', Type.CONDITION, true);

    this.description = "目标的法力值需要在指定范围";

    this.data.push(new ListValue('类型', 'type', [ 'Mana', 'Percent', 'Difference', 'Difference Percent' ], 'Mana')
        .setTooltip('分别为 法力值 法力值百分比(自带百分号) 与施法者法力值的差距 与施法者法力值的差距的百分比')
    );
    this.data.push(new AttributeValue('最小值', 'min-value', 0, 0)
        .setTooltip('目标法力值或法力值百分比需要高于最小值,Difference类型下,正值代表目标法力值需要至少高于施法者指定数值')
    );
    this.data.push(new AttributeValue('Max Value', 'max-value', 10, 2)
        .setTooltip('目标法力值或法力值百分比需要低于最大值,Difference类型下,负值代表目标法力值需要至多低于施法者指定数值')
    );
}

extend('ConditionMoney', 'Component');

function ConditionMoney() {
    this.super('金钱', Type.CONDITION, true);

    this.description = "目标的金币需要在指定范围(需要Vault和一个经济插件)";
	
    this.data.push(new ListValue('类型', 'type', ['Min', 'Max', 'Between'], 'Min')
        .setTooltip('进行比较的类型')
    );
    this.data.push(new AttributeValue('最小值', 'min-value', 10, 0)
        .requireValue('type', ['Min', 'Between'])
        .setTooltip('目标必须有最小金币（包括）')
    );
    this.data.push(new AttributeValue('最大值', 'max-value', 100, 0)
        .requireValue('type', ['Max', 'Between'])
        .setTooltip('目标可以有的最大金币（包括）')
    );
}

extend('ConditionMounted', 'Component');

function ConditionMounted() {
    this.super('已骑乘', Type.CONDITION, true);

    this.description = '目标是由所选实体类型之一'

    this.data.push(new MultiListValue('类型', 'types', getAnyEntities, ['Any'])
        .setTooltip('选择判断目标骑乘的实体类型')
    );

}

extend('ConditionMounting', 'Component');

function ConditionMounting() {
    this.super('正在上骑乘', Type.CONDITION, true);

    this.description = '目标正在骑乘所选实体类型之一'

    this.data.push(new MultiListValue('类型', 'types', getAnyEntities, ['Any'])
        .setTooltip('选择判断目标骑乘的实体类型')
    );

}

extend('ConditionMythicMobType', 'Component');

function ConditionMythicMobType() {
    this.super('神话怪物类型', Type.CONDITION, true);

    this.description = '如果目标对应于输入的神话怪物类型之一，则应用子元素，或者如果留空则不是神话怪物'

    this.data.push(new StringListValue('神话怪物类型', 'types', [])
        .setTooltip('要定位的神话怪物类型')
    );
}

extend('ConditionName', 'Component');

function ConditionName() {
    this.super('名字', Type.CONDITION, true);

    this.description = '目标的名字需要包含(或不包含)指定文本';

    this.data.push(new ListValue('类型', 'contains', [ 'True', 'False' ], 'True')
        .setTooltip('True为包含,False为不包含')
    );
    this.data.push(new ListValue('正则表达式', 'regex', [ 'True', 'False' ], 'False')
        .setTooltip('物品的名字和lore是否需要被正则表达式所检索,False为不需要')
    );
    this.data.push(new StringValue('文本', 'text', 'text')
        .setTooltip('目标的名字需要包含(或不包含)的文本')
    );
}

extend('ConditionOffhand', 'Component');

function ConditionOffhand() {
    this.super('副手', Type.CONDITION, true);
    this.description = "Applies child components when the target is wielding an item matching the given material as an offhand item. This is for v1.9+ servers only.";

    addItemConditionOptions(this);
}

extend('ConditionPermission', 'Component');

function ConditionPermission() {
    this.super('权限', Type.CONDITION, true);

    this.description = '需要施法者拥有指定权限';

    this.data.push(new StringValue('权限名', 'perm', 'some.permission')
        .setTooltip('施法者所需要拥有的权限名称')
    );
}

extend('ConditionPotion', 'Component');

function ConditionPotion() {
    this.super('药水效果', Type.CONDITION, true);

    this.description = '需要目标有(或没有)指定的药水效果';

    this.data.push(new ListValue('类型', 'type', [ 'Active', 'Not Active' ], 'Active')
        .setTooltip('分别为 有 没有')
    );
    this.data.push(new ListValue('药水效果', 'potion', getAnyPotion, 'Any')
        .setTooltip('药水效果的类型')
    );
    this.data.push(new AttributeValue('最小等级', 'min-rank', 0, 0)
        .setTooltip('药水效果的等级需要大于最小等级')
    );
    this.data.push(new AttributeValue('最大等级', 'max-rank', 999, 0)
        .setTooltip('药水效果的等级需要小于于最大等级')
    );
}

extend('ConditionSkillLevel', 'Component');

function ConditionSkillLevel(skill) {
    this.super('技能等级', Type.CONDITION, true);

    this.description = '需要施法者的技能等级在指定范围内,可用于技能到达一定等级后增加效果';

    this.data.push(new StringValue('技能', 'skill', skill)
        .setTooltip('所需要检测等级的技能的名称')
    );
    this.data.push(new IntValue('最小等级', 'min-level', 2)
        .setTooltip('技能的等级需要大于于最小等级')
    );
    this.data.push(new IntValue('最大等级', 'max-level', 99)
        .setTooltip('技能的等级需要小于于最大等级')
    );
}

extend('ConditionSlot', 'Component');

function ConditionSlot() {
    this.super('槽位', Type.CONDITION, true);
    this.description = "Applies child components when the target player has a matching item in the given slot.";

    this.data.push(new StringListValue('槽位(一行一个)', 'slot', [9])
        .setTooltip('位的位置 0-8代表快捷栏 9-35代表物品栏 36-39是护甲栏 40是副手,如果有多个,则需要全部满足')
    );

    addItemConditionOptions(this);
}

extend('ConditionStatus', 'Component');

function ConditionStatus() {
    this.super('状态', Type.CONDITION, true);

    this.description = '目标需要在(或不在)指定状态';

    this.data.push(new ListValue('类型', 'type', [ 'Active', 'Not Active' ], 'Active')
        .setTooltip('分别为在 不在')
    );
    this.data.push(new ListValue('状态', 'status', [ 'Any', 'Absorb', 'Curse', 'Disarm', 'Invincible', 'Root', 'Silence', 'Stun' ], 'Any')
        .setTooltip('目标需要的状态,分别为 任意 吸收 诅咒 缴械 无敌 禁锢 沉默 眩晕')
    );
}

extend('ConditionTime', 'Component');

function ConditionTime() {
    this.super('时间', Type.CONDITION, true);

    this.description = '需要当前世界到达指定时间';

    this.data.push(new ListValue('时间', 'time', [ 'Day', 'Night' ], 'Day')
        .setTooltip('分别为 白天 黑夜')
    );
}

extend('ConditionTool', 'Component');

function ConditionTool() {
    this.super('工具', Type.CONDITION, true);

    this.description = '需要目标挥舞指定工具';

    this.data.push(new ListValue('材质', 'material', [ 'Any', 'Wood', 'Stone', 'Iron', 'Gold', 'Diamond' ], 'Any')
        .setTooltip('工具的材质,分别为 任意 木头 石头 铁 金 钻石')
    );
    this.data.push(new ListValue('工具', 'tool', [ 'Any', 'Axe', 'Hoe', 'Pickaxe', 'Shovel', 'Sword' ], 'Any')
        .setTooltip('工具的类型，分别为 任意 斧子 锄头 稿子 铲子 剑')
    );
}

extend('ConditionValue', 'Component');

function ConditionValue() {
    this.super('数值', Type.CONDITION, true);

    this.description = '需要目标的指定数值达到指定范围';

    this.data.push(new StringValue('数值名', 'key', 'value')
        .setTooltip('不可重复,可在"技能效果"中添加或更改')
    );
    this.data.push(new AttributeValue('最小值', 'min-value', 1, 0)
        .setTooltip('需要大于最小值')
    );
    this.data.push(new AttributeValue('最大值', 'max-value', 999, 0)
        .setTooltip('需要小于最大值')
    );
}

extend('ConditionWater', 'Component');

function ConditionWater() {
    this.super('水', Type.CONDITION, true);

    this.description = '目标需要在(或不在)水中';

    this.data.push(new ListValue('类型', 'state', [ 'In Water', 'Out Of Water' ], 'In Water')
        .setTooltip('分别为 在水中 不在水中')
    );
}

extend('ConditionWeather', 'Component');

function ConditionWeather() {
    this.super('天气', Type.CONDITION, true);

    this.description = '目标所在位置需要有指定的天气';

    this.data.push(new ListValue('天气类型', 'type', [ 'None', 'Rain', 'Snow', 'Thunder' ], 'Rain')
        .setTooltip('分别为 晴朗 雨天 雪天 雷雨天')
    );
}

extend('ConditionWorld', 'Component');

function ConditionWorld() 
{
    this.super('世界', Type.CONDITION, true);

    this.description = 'Applies child components when the target is in a specific world';

    this.data.push(new ListValue('黑名单', 'blacklist', ['True', 'False'], 'False')
        .setTooltip('Whether the list should be seen as a blacklist')
    );

    this.data.push(new StringListValue('世界', 'worlds', [])
        .setTooltip("应该考虑哪些世界")
    );

}

// -- Mechanic constructors ---------------------------------------------------- //

extend('MechanicAttribute', 'Component');

function MechanicAttribute() {
    this.super('属性', Type.MECHANIC, false);

    this.description = '给与目标玩家指定时间的属性加成';

    this.data.push(new StringValue('属性', 'key', 'Intelligence')
        .setTooltip('需要加成的属性名称')
    );
    this.data.push(new ListValue('操作', 'operation', ['ADD_NUMBER', 'MULTIPLY_PERCENTAGE'], 'ADD_NUMBER')
        .setTooltip('对原始值乘以数量的操作，ADD NUMBER:标量相加，MULTIPLY PERCENTAGE:将值乘以数量')
    );
    this.data.push(new AttributeValue('数值', 'amount', 5, 2)
        .setTooltip('需要加成的数值')
    );
    this.data.push(new AttributeValue('时间', 'seconds', 3, 0)
        .setTooltip('属性加成持续的时间')
    );
    this.data.push(new ListValue('堆叠', 'stackable', [ 'True', 'False' ], 'False')
        .setTooltip('[付费版专享] 是否允许加成时间堆叠 False为不允许')
    );
}
extend('MechanicArmor', 'Component');

function MechanicArmor() {
    this.super('盔甲', Type.MECHANIC, false);

    this.description = '将目标指定的护甲槽设置为由设置定义的项目';

    this.data.push(new ListValue('栏位', 'slot', ['Hand', 'Off Hand', 'Feet', 'Legs', 'Chest', 'Head'], 'Hand')
        .setTooltip('要将项设置到的槽位号分别为主手 副手 鞋子 裤子 胸甲 头盔')
    );
    this.data.push(new ListValue('覆盖', 'overwrite', ['True', 'False'], 'False')
        .setTooltip('谨慎使用。是否覆盖插槽中的现有项。如果为true，将永久删除现有的iem')
    );
	addItemOptions(this)
}

extend('MechanicArmorStand', 'Component');

function MechanicArmorStand() {
    this.super('盔甲架', Type.MECHANIC, true);

    this.description = '召唤一个盔甲架，可以用作标记或物品展示(选择盔甲机制)。在装甲支架上应用子组件';

    this.data.push(new StringValue('盔甲架', 'key', 'default')
        .setTooltip('The key to refer to the armorstand by. Only one armorstand of each key can be active per target at the time')
    );
    this.data.push(new AttributeValue('持续时间', 'duration', 5, 0)
        .setTooltip('How long the armorstand lasts before being deleted')
    );
    this.data.push(new StringValue('名字', 'name', 'Armor Stand')
        .setTooltip('The name the armor stand displays')
    );
    this.data.push(new ListValue('名字可见', 'name-visible', ['True', 'False'], 'False')
        .setTooltip('Whether the armorstand\'s name should be visible from afar')
    );
    this.data.push(new ListValue('跟随目标', 'follow', ['True', 'False'], 'False')
        .setTooltip('Whether the armorstand should follow the target')
    );
    this.data.push(new ListValue('应用重力', 'gravity', ['True', 'False'], 'True')
        .setTooltip('Whether the armorstand should be affected by gravity')
    );
    this.data.push(new ListValue('小', 'tiny', ['True', 'False'], 'False')
        .setTooltip('Whether the armorstand should be small')
    );
    this.data.push(new ListValue('显示手臂', 'arms', ['True', 'False'], 'False')
        .setTooltip('Whether the armorstand should display its arms')
    );
    this.data.push(new ListValue('显示基板', 'base', ['True', 'False'], 'False')
        .setTooltip('Whether the armorstand should display its base plate')
    );
    this.data.push(new ListValue('可见', 'visible', ['True', 'False'], 'True')
        .setTooltip('Whether the armorstand should be visible')
    );
    this.data.push(new ListValue('标记', 'marker', ['True', 'False'], 'True')
        .setTooltip('Setting this to true will remove the armor stand\'s hitbox')
    );
    this.data.push(new SectionMarker('偏移'));
    this.data.push(new AttributeValue('向前偏移', 'forward', 0, 0)
        .setTooltip('How far forward in front of the target the armorstand should be in blocks. A negative value will put it behind.')
    );
    this.data.push(new AttributeValue('向上偏移', 'upward', 0, 0)
        .setTooltip('How far above the target the armorstand should be in blocks. A negative value will put it below.')
    );
    this.data.push(new AttributeValue('向右偏移', 'right', 0, 0)
        .setTooltip('How far to the right the armorstand should be of the target. A negative value will put it to the left.')
    );
}

extend('MechanicArmorStandPose', 'Component');

function MechanicArmorStandPose() {
    this.super('盔甲架造型', Type.MECHANIC, false);

    this.description = '设置一个盔甲架目标的姿势。值的格式应为x,y,z，其中旋转的单位为度数。例如:0.0,0.0,0.0';

    this.data.push(new StringValue('头', 'head', '').setTooltip('The pose values of the head. Leave empty if should be ignored')
    );
    this.data.push(new StringValue('身体', 'body', '').setTooltip('The pose values of the body. Leave empty if should be ignored')
    );
    this.data.push(new StringValue('左手', 'left-arm', '').setTooltip('The pose values of the left arm. Leave empty if should be ignored')
    );
    this.data.push(new StringValue('右手', 'right-arm', '').setTooltip('The pose values of the right arm. Leave empty if should be ignored')
    );
    this.data.push(new StringValue('左脚', 'left-leg', '').setTooltip('The pose values of the left leg. Leave empty if should be ignored')
    );
    this.data.push(new StringValue('右脚', 'right-leg', '').setTooltip('The pose values of the right leg. Leave empty if should be ignored')
    );
}

extend('MechanicBlock', 'Component');

function MechanicBlock() {
    this.super('方块', Type.MECHANIC, false);

    this.description = '在指定时间内将指定地区的方块替换为指定方块';

    this.data.push(new ListValue('形状', 'shape', [ 'Sphere', 'Cuboid' ], 'Sphere' )
        .setTooltip('生成的形状,分别为 球体 长方体')
    );
    this.data.push(new ListValue('方式', 'type', [ 'Air', 'Any', 'Solid' ], 'Solid' )
        .setTooltip('方块替换的方式 分别为 替换空气 替换所有方块 替换非空气方块')
    );
    this.data.push(new ListValue('方块', 'block', getMaterials, 'Ice')
        .setTooltip('替换成的方块种类')
    );
    this.data.push(new IntValue('方块数据', 'data', 0)
        .setTooltip('方块的数据值，主要用于牌子，羊毛，地毯以及类似方块')
    );
    this.data.push(new AttributeValue('时间', 'seconds', 5, 0)
        .setTooltip('方块替换的时间')
    );

    // Sphere options
    this.data.push(new AttributeValue('半径', 'radius', 3, 0).requireValue('shape', [ 'Sphere' ])
        .setTooltip('球体的半径')
    );

    // Cuboid options
    this.data.push(new AttributeValue('宽(X)', 'width', 5, 0).requireValue('shape', [ 'Cuboid' ])
        .setTooltip('长方体的宽度')
    );
    this.data.push(new AttributeValue('长(Y)', 'height', 5, 0).requireValue('shape', [ 'Cuboid' ])
        .setTooltip('长方体的长度')
    );
    this.data.push(new AttributeValue('高 (Z)', 'depth', 5, 0).requireValue('shape', [ 'Cuboid' ])
        .setTooltip('长方体的高度')
    );

    this.data.push(new SectionMarker('偏移'));
    this.data.push(new AttributeValue('向前偏移', 'forward', 0, 0)
        .setTooltip('在目标向前偏移的位置生成方块，负数则向后偏移')
    );
    this.data.push(new AttributeValue('向上偏移', 'upward', 0, 0)
        .setTooltip('在目标向上偏移的位置生成方块，负数则向下偏移')
    );
    this.data.push(new AttributeValue('向右偏移', 'right', 0, 0)
        .setTooltip('在目标向右偏移的位置生成方块，负数则向左偏移')
    );
}

extend('MechanicBuff', 'Component');

function MechanicBuff() {
    this.super('英语', Type.MECHANIC, false);

    this.description = '给与目标战斗加成';

    this.data.push(new ListValue('立即', 'immediate', [ 'True', 'False' ], 'False')
        .setTooltip('是否将加成立即用于当前的技能效果')
    );
    this.data.push(new ListValue('类型', 'type', [ 'DAMAGE', 'DEFENSE', 'SKILL_DAMAGE', 'SKILL_DEFENSE', 'HEALING' ], 'DAMAGE')
        .requireValue('immediate', [ 'False' ])
        .setTooltip('战斗加成的类型 分别为 物理伤害 物理防御 技能伤害 技能防御 治疗强度')
    );
    this.data.push(new ListValue('加成方式', 'modifier', [ 'Flat', 'Multiplier' ], 'Flat')
        .setTooltip('分别为 数值加成 倍数加成')
    );
    this.data.push(new StringValue('技能名称', 'category', '')
        .requireValue('type', [ 'SKILL_DAMAGE', 'SKILL_DEFENSE' ])
        .setTooltip('需要进行加成的技能的名称，留空代表对所有技能都有加成')
    );
    this.data.push(new AttributeValue('数值', 'value', 1, 0)
        .setTooltip('需要加成的数值 倍数加成中,增加5%即为 1.05 减少5%即为 0.95')
    );
    this.data.push(new AttributeValue('时间', 'seconds', 3, 0)
        .requireValue('immediate', [ 'False' ])
        .setTooltip('加成持续的时间')
    );
}

extend('MechanicCancel', 'Component');

function MechanicCancel() {
    this.super('取消', Type.MECHANIC, false);

    this.description = '取消由于该技能被触发的伤害.例如,如果该技能的触发需要"进行一次射击"则技能效果为该选项会取消射击所造成的伤害,应该与其他技能效果配合';
}

extend('MechanicCancelEffect', 'Component');

function MechanicCancelEffect() {
    this.super('取消效果', Type.MECHANIC, false);

    this.description = '提前取消粒子效果';

    this.data.push(new StringValue('效果名称', 'effect-key', 'default')
        .setTooltip('效果被设置时所使用的名称')
    );
}

extend('MechanicChannel', 'Component');

function MechanicChannel() {
    this.super('吟唱', Type.MECHANIC, true);

    this.description = '在吟唱过后应用子效果(可以中断).期间玩家不能移动(移动则取消),攻击或释放其他技能';

    this.data.push(new ListValue('固定', 'still', [ 'True', 'False' ], 'True')
        .setTooltip('玩家吟唱时是否被强制固定 True为是')
    );
    this.data.push(new AttributeValue('时间', 'time', 3, 0)
        .setTooltip('玩家所需吟唱的时间,单位为秒')
    );
}

extend('MechanicCleanse', 'Component');

function MechanicCleanse() {
    this.super('净化', Type.MECHANIC, false);

    this.description = '清除目标的负面药水效果或状态';

    this.data.push(new ListValue('药水效果', 'potion', getBadPotions, 'All')
        .setTooltip('分别为 所有效果 不清除药水效果 失明 反胃 饥饿 浮空 中毒 缓慢 挖掘疲劳 不幸 虚弱 凋零')
    );
    this.data.push(new ListValue('状态', 'status', [ 'All', 'None', 'Curse', 'Disarm', 'Root', 'Silence', 'Stun' ], 'All')
        .setTooltip('分别为 所有状态 不清除负面状态 诅咒 缴械 禁锢 沉默 眩晕')
    );
}

extend('MechanicCommand', 'Component');

function MechanicCommand() {
    this.super('命令', Type.MECHANIC, false);

    this.description ='以OP或控制台作为身份对每个目标执行指定指令';

    this.data.push(new StringValue('指令', 'command', '')
        .setTooltip('需要执行的指令,使用{player}来代替玩家名称')
    );
    this.data.push(new ListValue('执行身份', 'type', [ 'Console', 'OP' ], 'OP')
        .setTooltip('以何种身份执行指令 Console将执行控制台的命令，而OP将在给予临时OP权限的同时让目标玩家执行它')
    );
}

extend('MechanicCooldown', 'Component');

function MechanicCooldown() {
    this.super('冷却', Type.MECHANIC, false);

    this.description = "减少目标指定技能的冷却时间,如果值为负数,则增加冷却";

    this.data.push(new StringValue('技能名称', 'skill', 'all')
        .setTooltip('需要减少冷却的技能的名称,填"all"代表减少所有技能的冷却')
    );
    this.data.push(new ListValue('方式', 'type', [ 'Seconds', 'Percent' ], 'Seconds')
        .setTooltip('减少冷却的方式,分别为 减少指定时间 减少百分比时间(完全冷却)')
    );
    this.data.push(new AttributeValue('数值', 'value', -1, 0)
        .setTooltip('减少冷却的时间的数值')
    );
}

extend('MechanicDamage', 'Component');

function MechanicDamage() {
    
    
    
    
    
    this.super('Damage', Type.MECHANIC, false);

    this.description = '对每个目标造成伤害,百分比类型中将造成百分比伤害';

    this.data.push(new ListValue('方式', 'type', [ 'Damage', 'Multiplier', 'Percent Left', 'Percent Missing' ], 'Damage')
        .setTooltip('造成伤害的方式 Damage:对目标造成指定数值的伤害 Multiplier:对目标造成最大血量的百分比的伤害 Percent Left:对目标造成剩余血量的百分比的伤害 Percent Missing:对目标造成最大血量及当前血量之间的差距的百分比的伤害')
    );
    this.data.push(new AttributeValue("数值", "value", 3, 1)
        .setTooltip('造成伤害的数值')
    );
    this.data.push(new ListValue('真实伤害', 'true', [ 'True', 'False' ], 'False')
        .setTooltip('是否造成真实伤害,真实伤害无视护甲和其他任何插件')
    );
    this.data.push(new StringValue('伤害类型名称', 'classifier', 'default')
        .setTooltip('[付费版专享] 可以造成不同类型的伤害,例如火属性/雷电属性')
    );
    this.data.push(new ListValue('应用击退', 'knockback', ['True', 'False'], 'True')
        .setTooltip('Whether the damage will inflict knockback. Ignored if it is True Damage')
    );
    this.data.push(new ListValue('伤害原因', 'cause', ['Contact', 'Entity Attack', 'Entity Sweep Attack', 'Projectile', 'Suffocation', 'Fall', 'Fire', 'Fire Tick', 'Melting', 'Lava', 'Drowning', 'Block Explosion', 'Entity Explosion', 'Void', 'Lightning', 'Suicide', 'Starvation', 'Poison', 'Magic', 'Wither', 'Falling Block', 'Thorns', 'Dragon Breath', 'Custom', 'Fly Into Wall', 'Hot Floor', 'Cramming', 'Dryout', 'Freeze', 'Sonic Boom'], 'Entity Attack')
        .setTooltip('Damage Cause considered by the server. This will have influence over the death message and ProRPGItems\' defenses')
        .requireValue('true', ['False'])
    );
}

extend('MechanicDamageBuff', 'Component');

function MechanicDamageBuff() {
    this.super('伤害加成', Type.MECHANIC, false);

    this.description = '在指定时间使每个目标增加指定数值的物理伤害';

    this.data.push(new ListValue('加成方式', 'type', [ 'Flat', 'Multiplier' ], 'Flat')
        .setTooltip('分别为 数值加成 倍数加成')
    );
    this.data.push(new ListValue('技能伤害', 'skill', [ 'True', 'False' ], 'False')
        .setTooltip('是否用于技能伤害的加成,False为不用于')
    );
    this.data.push(new AttributeValue('数值', 'value', 1, 0)
        .setTooltip('伤害加成的数值,倍数加成中,增加5%伤害即为 1.05 减少5%伤害即为 0.95')
    );
    this.data.push(new AttributeValue('时间', 'seconds', 3, 0)
        .setTooltip('伤害加成的时间')
    );
}

extend('MechanicDamageLore', 'Component');

function MechanicDamageLore() {
    this.super('Damage Lore', Type.MECHANIC, false);

    this.description = '根据手持物品的Lore对每个目标造成伤害';

    this.data.push(new ListValue("手部", "hand", [ 'Main', 'Offhand' ], 'Main')
        .setTooltip('物品需要在主手还是副手,Main是主手Offhand是副手,只对1.9及以上版本有效')
    );
    this.data.push(new StringValue('正则表达式', 'regex', 'Damage: {value}')
        .setTooltip('文本的正则表达式，不会可以去学一下.{value}为伤害数值')
    );
    this.data.push(new AttributeValue('伤害倍数', 'multiplier', 1, 0)
        .setTooltip('在{value}基础上的倍数')
    );
    this.data.push(new ListValue('真实伤害', 'true', [ 'True', 'False' ], 'False')
        .setTooltip('是否造成真实伤害,真实伤害无视护甲和其他任何插件,False为否')
    );
    this.data.push(new StringValue('伤害类型名称', 'classifier', 'default')
        .setTooltip('[付费版专享] 可以造成不同类型的伤害,例如火属性/雷电属性')
    );
    this.data.push(new ListValue('应用击退', 'knockback', ['True', 'False'], 'True')
        .setTooltip('Whether the damage will inflict knockback. Ignored if it is True Damage')
    );
    this.data.push(new ListValue('伤害原因', 'cause', ['Contact', 'Entity Attack', 'Entity Sweep Attack', 'Projectile', 'Suffocation', 'Fall', 'Fire', 'Fire Tick', 'Melting', 'Lava', 'Drowning', 'Block Explosion', 'Entity Explosion', 'Void', 'Lightning', 'Suicide', 'Starvation', 'Poison', 'Magic', 'Wither', 'Falling Block', 'Thorns', 'Dragon Breath', 'Custom', 'Fly Into Wall', 'Hot Floor', 'Cramming', 'Dryout', 'Freeze', 'Sonic Boom'], 'Entity Attack')
        .setTooltip('Damage Cause considered by the server. This will have influence over the death message and ProRPGItems\' defenses')
        .requireValue('true', ['False'])
    );
}

extend('MechanicDefenseBuff', 'Component');

function MechanicDefenseBuff() {
    this.super('防御加成', Type.MECHANIC, false);

    this.description = '在指定时间使每个目标减免指定数值的物理伤害';

    this.data.push(new ListValue('方式', 'type', [ 'Flat', 'Multiplier' ], 'Flat')
        .setTooltip('分别为 数值减免 倍数减免')
    );
    this.data.push(new ListValue('技能伤害减免', 'skill', [ 'True', 'False' ], 'False')
        .setTooltip('是否用于技能伤害的减免,False为不用于')
    );
    this.data.push(new AttributeValue('数值', 'value', 1, 0)
        .setTooltip('伤害减免的数值,倍数加成中,5％的伤害减免buff应把Multiplier设成0.95,因为目标将遭受95％的伤害')
    );
    this.data.push(new AttributeValue('时间', 'seconds', 3, 0)
        .setTooltip('伤害减免的时间')
    );
}

extend('MechanicDelay', 'Component');

function MechanicDelay() {
    this.super('延迟', Type.MECHANIC, true);

    this.description = '在指定延迟后应用子内容';

    this.data.push(new AttributeValue('延迟时间', 'delay', 2, 0)
        .setTooltip('延迟的时间,单位为秒')
    );
}

extend('MechanicDisguise', 'Component');

function MechanicDisguise() {
    this.super('伪装', Type.MECHANIC, false);

    this.description = '将目标进行指定的伪装,需要有LibsDisguise插件支持';

    this.data.push(new AttributeValue('持续时间', 'duration', -1, 0)
        .setTooltip('伪装持续的时间，如果是负数则永久伪装')
    );
    this.data.push(new ListValue('类型', 'type', [ 'Mob', 'Player', 'Misc' ], 'Mob')
        .setTooltip('目标伪装成的类型,分别为 生物 玩家 杂项')
    );

    this.data.push(new ListValue('生物', 'mob', [ 'Bat', 'Blaze', 'Cave Spider', 'Chicken', 'Cow', 'Creeper', 'Donkey', 'Elder Guardian', 'Ender Dragon', 'Enderman', 'Endermite', 'Ghast', 'Giant', 'Guardian', 'Horse', 'Iron Golem', 'Magma Cube', 'Mule', 'Mushroom Cow', 'Ocelot', 'Pig', 'Pig Zombie', 'Rabbit', 'Sheep', 'Shulker', 'Silverfish', 'Skeleton', 'Slime', 'Snowman', 'Spider', 'Squid', 'Undead Horse', 'Villager', 'Witch', 'Wither', 'Wither Skeleton', 'Wolf', 'Zombie', 'Zombie Villager'], 'Zombie')
        .requireValue('type', [ 'Mob' ])
        .setTooltip('伪装成的生物的种类')
    );
    this.data.push(new ListValue('成体', 'adult', [ 'True', 'False', ], 'True')
        .requireValue('type', [ 'Mob' ])
        .setTooltip('生物是否为成体,如大鸡和小鸡,True代表成体')
    );

    this.data.push(new StringValue('玩家', 'player', 'Eniripsa96')
        .requireValue('type', [ 'Player' ])
        .setTooltip('伪装成的玩家的名字')
    );

    this.data.push(new ListValue('杂项', 'misc', [ 'Area Effect Cloud', 'Armor Stand', 'Arrow', 'Boat', 'Dragon Fireball', 'Dropped Item', 'Egg', 'Ender Crystal', 'Ender Pearl', 'Ender Signal', 'Experience Orb', 'Falling Block', 'Fireball', 'Firework', 'Fishing Hook', 'Item Frame', 'Leash Hitch', 'Minecart', 'Minecart Chest', 'Minecart Command', 'Minecart Furnace', 'Minecart Hopper', 'Minecart Mob Spawner', 'Minecart TNT', 'Painting', 'Primed TNT', 'Shulker Bullet', 'Snowball', 'Spectral Arrow', 'Splash Potion', 'Tipped Arrow', 'Thrown EXP Bottle', 'Wither Skull' ], 'Painting')
        .requireValue('type', [ 'Misc' ])
        .setTooltip('伪装成杂项的类型')
    );
    this.data.push(new IntValue('数据值', 'data', 0)
        // .requireValue('type', [ 'Misc' ])
        .requireValue('misc', ['Area Effect Cloud',
                               'Armor Stand',
                               'Arrow',
                               'Boat',
                               'Dragon Fireball',
                               'Egg',
                               'Ender Crystal',
                               'Ender Pearl',
                               'Ender Signal',
                               'Experience Orb',
                               'Fireball',
                               'Firework',
                               'Fishing Hook',
                               'Item Frame',
                               'Leash Hitch',
                               'Minecart',
                               'Minecart Chest',
                               'Minecart Command',
                               'Minecart Furnace',
                               'Minecart Hopper',
                               'Minecart Mob Spawner',
                               'Minecart TNT',
                               'Painting',
                               'Primed TNT',
                               'Shulker Bullet',
                               'Snowball',
                               'Spectral Arrow',
                               'Splash Potion',
                               'Tipped Arrow',
                               'Thrown EXP Bottle',
                               'Wither Skull'])
        .setTooltip('Data value to use for the disguise type. What it does depends on the disguise')
    );

    this.data.push(new ListValue('材质', 'mat', getMaterials, 'Anvil')
        // .requireValue('type', [ 'Misc' ])
        .requireValue('misc', ['Dropped Item', 'Falling Block'])
        .setTooltip('Material to use for the disguise type. Note that items used for falling block will not function.')
    );
}

extend('MechanicDurability', 'Component');

function MechanicDurability() {
    this.super('耐久', Type.MECHANIC, false);

    this.description = '降低目标所持物品的耐久度';

    this.data.push(new AttributeValue('数值', 'amount', 1, 0)
        .setTooltip('需要降低耐久的数值')
    );
    this.data.push(new ListValue('副手', 'offhand', [ 'True', 'False' ], 'False')
        .setTooltip('是否同时应用于副手,False为否')
    );
}

extend('MechanicExplosion', 'Component');

function MechanicExplosion() {
    this.super('爆炸', Type.MECHANIC, false);

    this.description = '在目标位置造成一次爆炸';

    this.data.push(new AttributeValue('威力', 'power', 3, 0)
        .setTooltip('爆炸的威力')
    );
    this.data.push(new ListValue('破坏方块', 'damage', [ 'True', 'False' ], 'False')
        .setTooltip('是否破坏方块,False为否')
    );
    this.data.push(new ListValue('着火', 'fire', [ 'True', 'False' ], 'False')
        .setTooltip('方块是否会着火,False为否')
    );
}

extend('MechanicFire', 'Component');

function MechanicFire() {
    this.super('Fire', Type.MECHANIC, false);

    this.description = '引燃目标指定时间';

    this.data.push(new AttributeValue('伤害', 'damage', 1, 0)
        .setTooltip('The damage dealt by each fire tick')
    );
    this.data.push(new AttributeValue('时间', 'seconds', 3, 1)
        .setTooltip('所引燃的时间,单位为秒')
    );
}

extend('MechanicFlag', 'Component');

function MechanicFlag() {
    this.super('标记', Type.MECHANIC, false);

    this.description = '标记目标一段时间,标记可以被"触发条件"和一些其他的东西所检测';

    this.data.push(new StringValue('标记名称', 'key', 'key')
        .setTooltip('不可重复,若需"触发条件"检测,则应设置为相同')
    );
    this.data.push(new AttributeValue('时间', 'seconds', 3, 1)
        .setTooltip('标记的持续时间,若想设置为永久,可在下面的"标记切换"中应用')
    );
}

extend('MechanicFlagClear', 'Component');

function MechanicFlagClear() {
    this.super('标记清除', Type.MECHANIC, false);

    this.description = '清除目标的标记';

    this.data.push(new StringValue('标记名称', 'key', 'key')
        .setTooltip('不可重复,需要与被清除的标记的名称相同')
    );
}

extend('MechanicFlagToggle', 'Component');

function MechanicFlagToggle() {
    this.super('标记切换', Type.MECHANIC, false);

    this.description = '切换目标标记的有无("有"标记的话持续时间应该是永久的)';

    this.data.push(new StringValue('标记名称', 'key', 'key')
        .setTooltip('不可重复,需要与被切换的标记的名称相同')
    );
}

extend('MechanicFood', 'Component');

function MechanicFood() {
    this.super('食物', Type.MECHANIC, false);

    this.description = '增加或减少目标的饱食度';

    this.data.push(new AttributeValue('数值', 'food', 1, 1)
        .setTooltip('需要增加的数值,负数为减少饱食度')
    );
    this.data.push(new AttributeValue('饱和度', 'saturation', 0, 0)
        .setTooltip('需要增加的数值,负数为减少饱和度,饱和度是隐藏的,影响饱食度下降的时间')
    );
}

extend('MechanicForgetTargets', 'Component');

function MechanicForgetTargets() {
    this.super('遗忘目标', Type.MECHANIC, false);

    this.description = '清除目标从"记住目标（很后面有）"那的存储';

    this.data.push(new StringValue('关键词', 'key', 'key')
        .setTooltip('存储目标的唯一关键词，与"标记名称"类似')
    );
}

extend('MechanicHeal', 'Component');

function MechanicHeal() {
    this.super('治疗', Type.MECHANIC, false);

    this.description = '回复每个目标的指定血量';

    this.data.push(new ListValue("类型", "type", [ "Health", "Percent" ], "Health")
        .setTooltip('治疗的类型,分别为 普通治疗 百分比治疗 百分比是按目标的最大血量进行治疗')
    );
    this.data.push(new AttributeValue("数值", "value", 3, 1)
        .setTooltip('回复血量的数值')
    );
}

extend('MechanicHealthSet', 'Component');

function MechanicHealthSet() {
    this.super('设置生命值', Type.MECHANIC, false);

    this.description = '将目标血量设置为指定数值,无视其他任何效果';

    this.data.push(new AttributeValue("生命值", "health", 1, 0)
        .setTooltip('需要设置的血量')
    );
}

extend('MechanicHeldItem', 'Component');

function MechanicHeldItem() {
    this.super('移动手持物品', Type.MECHANIC, false);

    this.description = '将目标手持的物品移动到其指定槽位中,如果槽位是技能快捷键将会无效';

    this.data.push(new AttributeValue("槽位", "slot", 0, 0)
        .setTooltip('所移动到的槽位')
    );
}

extend('MechanicImmunity', 'Component');

function MechanicImmunity() {
    this.super('Immunity', Type.MECHANIC, false);

    this.description = 'Provides damage immunity from one source for a duration.'

    this.data.push(new ListValue('Type', 'type', getDamageTypes, 'Poison')
        .setTooltip('The damage type to give an immunity for')
    );
    this.data.push(new AttributeValue('Seconds', 'seconds', 3, 0)
        .setTooltip('How long to give an immunity for')
    );
    this.data.push(new AttributeValue('Multiplier', 'multiplier', 0, 0)
        .setTooltip('The multiplier for the incoming damage. Use 0 if you want full immunity.')
    );
}

extend('MechanicInterrupt', 'Component');

function MechanicInterrupt() {
    this.super('Interrupt', Type.MECHANIC, false);

    this.description = 'Interrupts any channeling being done by each target if applicable.';
}

extend('MechanicItem', 'Component');

function MechanicItem() {
    this.super('Item', Type.MECHANIC, false);

    this.description = 'Gives each player target the item defined by the settings.';

    addItemOptions(this);
}

extend('MechanicItemDrop', 'Component');

function MechanicItemDrop() {
    this.super('Item Drop', Type.MECHANIC, false);

    this.description = 'Spawns a dropped item defined by the settings at the specified location.';
	
    this.data.push(new AttributeValue('Pickup Delay', 'pickup_delay', 10, 0)
        .setTooltip('How many ticks must pass before the item can be picked up, in ticks.')
    );
    this.data.push(new AttributeValue('Duration', 'duration', 6000, 0)
        .setTooltip('The time after which the item will despawn if not picked up, in ticks. Caps at 6000.')
    );

    addItemOptions(this);
	
	this.data.push(new SectionMarker("Offset"));
    this.data.push(new AttributeValue('Forward offset', 'forward', 0, 0)
        .setTooltip('How far forward in blocks to teleport. A negative value teleports backwards.')
    );
    this.data.push(new AttributeValue('Upward offset', 'upward', 0, 0)
        .setTooltip('How far upward in blocks to teleport. A negative value teleports downward.')
    );
    this.data.push(new AttributeValue('Right offset', 'right', 0, 0)
        .setTooltip('How far to the right in blocks to teleport. A negative value teleports to the left.')
    );
}

extend('MechanicItemProjectile', 'Component');

function MechanicItemProjectile() {
    this.super('Item Projectile', Type.MECHANIC, true);

    this.description = 'Launches a projectile using an item as its visual that applies child components upon landing. The target passed on will be the collided target or the location where it landed if it missed.';
    
    this.data.push(new ListValue("Group", "group", ["Ally", "Enemy"], "Enemy")
        .setTooltip('The alignment of targets to hit')
    );

	addItemOptions(this);
    addProjectileOptions(this);
    addEffectOptions(this, true);
}

extend('MechanicItemRemove', 'Component');

function MechanicItemRemove() {
    this.super('Item Remove', Type.MECHANIC, false);

    this.description = 'Removes an item from a player inventory. This does nothing to mobs.';

    this.data.push(new AttributeValue('Amount', 'amount', 1, 0)
        .setTooltip('The amount of the item needed in the player\'s inventory')
    );

    addItemConditionOptions(this);
}

extend('MechanicLaunch', 'Component');

function MechanicLaunch() {
    this.super('Launch', Type.MECHANIC, false);

    this.description = 'Launches the target relative to their forward direction. Use negative values to go in the opposite direction (e.g. negative forward makes the target go backwards)';

    this.data.push(new ListValue('Relative', 'relative', ['Target', 'Caster', 'Between'], 'Target')
        .setTooltip('Determines what is considered "forward". Target uses the direction the target is facing, Caster uses the direction the caster is facing, and Between uses the direction from the caster to the target.')
    );
    this.data.push(new AttributeValue('Forward Speed', 'forward', 0, 0)
        .setTooltip('The speed to give the target in the direction they are facing')
    );
    this.data.push(new AttributeValue('Upward Speed', 'upward', 2, 0.5)
        .setTooltip('The speed to give the target upwards')
    );
    this.data.push(new AttributeValue('Right Speed', 'right', 0, 0)
        .setTooltip('The speed to give the target to their right')
    );
}

extend('MechanicLightning', 'Component');

function MechanicLightning() {
    this.super('Lightning', Type.MECHANIC, true);

    this.description = 'Strikes lightning on or near the target, applying child components to the struck targets. Negative offsets will offset it in the opposite direction (e.g. negative forward offset puts it behind the target).';

    this.data.push(new AttributeValue('Damage', 'damage', 5, 0)
        .setTooltip('The damage dealt by the lightning bolt')
    );
    this.data.push(new ListValue("Group", "group", ["Ally", "Enemy", "Both"], "Enemy")
        .setTooltip('The alignment of targets to hit')
    );
    this.data.push(new ListValue("Include Caster", "caster", ['True', 'False'], 'False')
        .setTooltip('Whether the lightning strike can hit the caster')
    );
	
	this.data.push(new SectionMarker("Offset"));
    this.data.push(new AttributeValue('Forward Offset', 'forward', 0, 0)
        .setTooltip('How far in front of the target in blocks to place the lightning')
    );
    this.data.push(new AttributeValue('Right Offset', 'right', 0, 0)
        .setTooltip('How far to the right of the target in blocks to place the lightning')
    );
}

extend('MechanicMana', 'Component');

function MechanicMana() {
    this.super('Mana', Type.MECHANIC, false);

    this.description = 'Restores or deducts mana from the target.';

    this.data.push(new ListValue('Type', 'type', ['Mana', 'Percent'], 'Mana')
        .setTooltip('The unit to use for the amount of mana to restore/drain. Mana does a flat amount while Percent does a percentage of their max mana')
    );
    this.data.push(new AttributeValue('Value', 'value', 1, 0)
        .setTooltip('The amount of mana to restore/drain')
    );
}

extend('MechanicMessage', 'Component');

function MechanicMessage() {
    this.super('Message', Type.MECHANIC, false);

    this.description = 'Sends a message to each player target. To include numbers from Value mechanics, use the filters {<key>} where <key> is the key the value is stored under.'

    this.data.push(new StringValue('Message', 'message', 'text')
        .setTooltip('The message to display. {player} = caster\'s name, {target} = target\'s name, {targetUUID} = target\'s UUID (useful if targets are non players), &lc: "{", &rc: "}", &sq: "\'"')
    );
}

extend('MechanicMine', 'Component');

function MechanicMine() {
    this.super('Mine', Type.MECHANIC, false);

    this.description = 'Destroys a selection of blocks at the location of the target.'
	
	this.data.push(new MultiListValue('Material', 'materials', ['Origin', ...getAnyMaterials()], ['Origin'])
        .setTooltip('The types of blocks allowed to be broken. \'Origin\' refers to the material at the targeted location')
    );
    this.data.push(new ListValue('Drop', 'drop', ['True', 'False'], 'True')
        .setTooltip('Whether to create drops for the destroyed blocks')
    );
    this.data.push(new ListValue('Tool', 'tool', ['Caster', 'Target', ...getMaterials()], 'Diamond pickaxe').requireValue('drop', ['True'])
        .setTooltip('What tool to use when breaking the blocks. This allows to take into account the fact that, for example, Diamond Ore does not drop when mined with a Stone Pickaxe, as well as to consider enchantments like Looting and Silk Touch. \'Caster\' an \'Target\' refers to the items in their respective main hands')
    );
	
    this.data.push(new ListValue('Shape', 'shape', ['Sphere', 'Cuboid'], 'Sphere')
        .setTooltip('The shape of the region to mine')
    );

    // Sphere options
    this.data.push(new AttributeValue('Radius', 'radius', 2, 0).requireValue('shape', ['Sphere'])
        .setTooltip('The radius of the sphere, in blocks')
    );

    // Cuboid options
    this.data.push(new AttributeValue('Width (X)', 'width', 3, 0).requireValue('shape', ['Cuboid'])
        .setTooltip('The width of the cuboid, in blocks')
    );
    this.data.push(new AttributeValue('Height (Y)', 'height', 3, 0).requireValue('shape', ['Cuboid'])
        .setTooltip('The height of the cuboid, in blocks')
    );
    this.data.push(new AttributeValue('Depth (Z)', 'depth', 3, 0).requireValue('shape', ['Cuboid'])
        .setTooltip('The depth of the cuboid, in blocks')
    );
	
	this.data.push(new SectionMarker("Offset"));
    this.data.push(new AttributeValue('Forward Offset', 'forward', 0, 0)
        .setTooltip('How far forward in front of the target the region should be in blocks. A negative value will put it behind.')
    );
    this.data.push(new AttributeValue('Upward Offset', 'upward', 0, 0)
        .setTooltip('How far above the target the region should be in blocks. A negative value will put it below.')
    );
    this.data.push(new AttributeValue('Right Offset', 'right', 0, 0)
        .setTooltip('How far to the right the region should be of the target. A negative value will put it to the left.')
    );
}

extend('MechanicMoney', 'Component');

function MechanicMoney() {
    this.super('Money', Type.MECHANIC, false);

    this.description = 'Adds or multiplies the target\'s balance by some amount (requires Vault and an economy plugin). Fails if the resulting balance is not within the range allowed by the economy plugin.'
	
    this.data.push(new ListValue('Type', 'type', ['Add', 'Multiply'], 'Add')
	.setTooltip('Whether the target\'s balance will be added or multiplied by the set amount.')
    );
    this.data.push(new AttributeValue('Amount', 'amount', 5, 0)
        .setTooltip('The amount that the target\'s balance will be added or multiplied by. Can be negative.')
    );
    this.data.push(new ListValue('Allows negative', 'allows_negative', ['True', 'False'], 'False')
		.setTooltip('Whether the mechanic will be executed even if it will result in the target having a negative balance.')
    );
}

extend('MechanicParticle', 'Component');

function MechanicParticle() {
    this.super('Particle', Type.MECHANIC, false);

    this.description = 'Plays a particle effect about the target.';

    addParticleOptions(this);

    this.data.push(new SectionMarker('Offset'));
    this.data.push(new DoubleValue('Forward Offset', 'forward', 0)
        .setTooltip('How far forward in front of the target in blocks to play the particles. A negative value will go behind.')
    );
    this.data.push(new DoubleValue('Upward Offset', 'upward', 0)
        .setTooltip('How far above the target in blocks to play the particles. A negative value will go below.')
    );
    this.data.push(new DoubleValue('Right Offset', 'right', 0)
        .setTooltip('How far to the right of the target to play the particles. A negative value will go to the left.')
    );
}

extend('MechanicParticleAnimation', 'Component');

function MechanicParticleAnimation() {
    this.super('Particle Animation', Type.MECHANIC, false);

    this.description = 'Plays an animated particle effect at the location of each target over time by applying various transformations.';

    this.data.push(new IntValue('Steps', 'steps', 1, 0)
        .setTooltip('The number of times to play particles and apply translations each application.')
    );
    this.data.push(new DoubleValue('Frequency', 'frequency', 0.05, 0)
        .setTooltip('How often to apply the animation in seconds. 0.05 is the fastest (1 tick). Lower than that will act the same.')
    );
    this.data.push(new IntValue('Angle', 'angle', 0)
        .setTooltip('How far the animation should rotate over the duration in degrees')
    );
    this.data.push(new IntValue('Start Angle', 'start', 0)
        .setTooltip('The starting orientation of the animation. Horizontal translations and the forward/right offsets will be based off of this.')
    );
    this.data.push(new AttributeValue('Duration', 'duration', 5, 0)
        .setTooltip('How long the animation should last for in seconds')
    );
    this.data.push(new AttributeValue('H-Translation', 'h-translation', 0, 0)
        .setTooltip('How far the animation moves horizontally relative to the center over a cycle. Positive values make it expand from the center while negative values make it contract.')
    );
    this.data.push(new AttributeValue('V-Translation', 'v-translation', 0, 0)
        .setTooltip('How far the animation moves vertically over a cycle. Positive values make it rise while negative values make it sink.')
    );
    this.data.push(new IntValue('H-Cycles', 'h-cycles', 1)
        .setTooltip('How many times to move the animation position throughout the animation. Every other cycle moves it back to where it started. For example, two cycles would move it out and then back in.')
    );
    this.data.push(new IntValue('V-Cycles', 'v-cycles', 1)
        .setTooltip('How many times to move the animation position throughout the animation. Every other cycle moves it back to where it started. For example, two cycles would move it up and then back down.')
    );

    addParticleOptions(this);

    this.data.push(new SectionMarker('Offset'));
    this.data.push(new DoubleValue('Forward Offset', 'forward', 0)
        .setTooltip('How far forward in front of the target in blocks to play the particles. A negative value will go behind.')
    );
    this.data.push(new DoubleValue('Upward Offset', 'upward', 0)
        .setTooltip('How far above the target in blocks to play the particles. A negative value will go below.')
    );
    this.data.push(new DoubleValue('Right Offset', 'right', 0)
        .setTooltip('How far to the right of the target to play the particles. A negative value will go to the left.')
    );

    this.data.push(new ListValue('Rotate w/ Player', '-with-rotation', ['True', 'False'], 'False')
        .setTooltip('Whether to follow the rotation of the player for the effect.')
    );
}

extend('MechanicParticleEffect', 'Component');

function MechanicParticleEffect() {
    this.super('Particle Effect', Type.MECHANIC, false);

    this.description = 'Plays a particle effect that follows the current target, using formulas to determine shape, size, and motion';

    addEffectOptions(this, false);
}

extend('MechanicParticleProjectile', 'Component');

function MechanicParticleProjectile() {
    this.super('Particle Projectile', Type.MECHANIC, true);

    this.description = 'Launches a projectile using particles as its visual that applies child components upon landing. The target passed on will be the collided target or the location where it landed if it missed.';

    this.data.push(new DoubleValue('Gravity', 'gravity', 0)
        .setTooltip('How much gravity to apply each tick. Negative values make it fall while positive values make it rise')
    );
    this.data.push(new ListValue('Pierce', 'pierce', ['True', 'False'], 'False')
        .setTooltip('Whether this projectile should pierce through initial targets and continue hitting those behind them')
    );
    this.data.push(new ListValue("Group", "group", ["Ally", "Enemy"], "Enemy")
        .setTooltip('The alignment of targets to hit')
    );
	
    addProjectileOptions(this);

    addParticleOptions(this);

    this.data.push(new DoubleValue('Frequency', 'frequency', 0.05)
        .setTooltip('How often to play a particle effect where the projectile is. It is recommended not to change this value unless there are too many particles playing')
    );

    addEffectOptions(this, true);
}

extend('MechanicPassive', 'Component');

function MechanicPassive() {
    this.super('Passive', Type.MECHANIC, true);

    this.description = 'Applies child components continuously every period. The seconds value below is the period or how often it applies.';

    this.data.push(new AttributeValue('Seconds', 'seconds', 1, 0)
        .setTooltip('The delay in seconds between each application')
    );
}

extend('MechanicPermission', 'Component');

function MechanicPermission() {
    this.super('Permission', Type.MECHANIC, true);

    this.description = 'Grants each player target a permission for a limited duration. This mechanic requires Vault with an accompanying permissions plugin in order to work.';

    this.data.push(new StringValue('Permission', 'perm', 'plugin.perm.key')
        .setTooltip('The permission to give to the player')
    );
    this.data.push(new AttributeValue('Seconds', 'seconds', 3, 0)
        .setTooltip('How long in seconds to give the permission to the player')
    );
}

extend('MechanicPotion', 'Component');

function MechanicPotion() {
    this.super('Potion', Type.MECHANIC, false);

    this.description = 'Applies a potion effect to the target for a duration.';

    this.data.push(new ListValue('Potion', 'potion', getPotionTypes, 'Absorption')
        .setTooltip('The type of potion effect to apply')
    );
    this.data.push(new ListValue('Ambient Particles', 'ambient', ['True', 'False'], 'True')
        .setTooltip('Whether to show ambient particles')
    );
    this.data.push(new AttributeValue('Tier', 'tier', 1, 0)
        .setTooltip('The strength of the potion')
    );
    this.data.push(new AttributeValue('Seconds', 'seconds', 3, 1)
        .setTooltip('How long to apply the effect for')
    );
}

extend('MechanicPotionProjectile', 'Component');

function MechanicPotionProjectile() {
    this.super('Potion Projectile', Type.MECHANIC, true);

    this.description = 'Drops a splash potion from each target that does not apply potion effects by default. This will apply child elements when the potion lands. The targets supplied will be everything hit by the potion. If nothing is hit by the potion, the target will be the location it landed.';

    this.data.push(new ListValue('Type', 'type', getPotionTypes, 'Fire Resistance')
        .setTooltip('The type of the potion to use for the visuals')
    );
    this.data.push(new ListValue("Group", "group", ["Ally", "Enemy", "Both"], "Enemy")
        .setTooltip('The alignment of entities to hit')
    );
    this.data.push(new ListValue('Linger', 'linger', ['True', 'False'], 'False')
        .setTooltip('Whether the potion should be a lingering potion (for 1.9+ only)')
    );
}

extend('MechanicProjectile', 'Component');

function MechanicProjectile() {
    this.super('Projectile', Type.MECHANIC, true);

    this.description = 'Launches a projectile that applies child components on hit. The target supplied will be the struck target.';

    this.data.push(new ListValue('Projectile', 'projectile', ['Arrow',
                                                              'Egg',
                                                              'Snowball',
                                                              'Fireball',
                                                              'Large Fireball',
                                                              'Small fireball'], 'Arrow')
        .setTooltip('The type of projectile to fire')
    );
    this.data.push(new ListValue('Flaming', 'flaming', ['True', 'False'], 'False')
        .setTooltip('Whether to make the launched projectiles on fire.')
    );
    this.data.push(new ListValue('Cost', 'cost', ['None', 'All', 'One'], 'None')
        .setTooltip('The item cost of the skill. "One" will only charge the player 1 item of it\'s type, whereas "All" will charge 1 for each fired projectile.')
    );

    addProjectileOptions(this);
    addEffectOptions(this, true);
}

extend('MechanicPurge', 'Component');

function MechanicPurge() {
    this.super('Purge', Type.MECHANIC, false);

    this.description = 'Purges the target of positive potion effects or statuses';

    this.data.push(new MultiListValue('Potion', 'potion', getGoodPotions)
        .setTooltip('The potion effect to remove from the target, if any')
    );
    this.data.push(new MultiListValue('Status', 'status', ['All', 'Absorb', 'Invincible'])
        .setTooltip('The status to remove from the target, if any')
    );
}

extend('MechanicPush', 'Component');

function MechanicPush() {
    this.super('Push', Type.MECHANIC, false);

    this.description = 'Pushes the target relative to the caster. This will do nothing if used with the caster as the target. Positive numbers apply knockback while negative numbers pull them in.';

    this.data.push(new ListValue('Type', 'type', ['Fixed', 'Inverse', 'Scaled'], 'Fixed')
        .setTooltip('How to scale the speed based on relative position. Fixed does the same speed to all targets. Inverse pushes enemies farther away faster. Scaled pushes enemies closer faster.')
    );
    this.data.push(new AttributeValue('Speed', 'speed', 3, 1)
        .setTooltip('How fast to push the target away. Use a negative value to pull them closer.')
    );
    this.data.push(new StringValue('Source', 'source', 'none')
        .setTooltip('The source to push/pull from. This should be a key used in a Remember Targets mechanic. If no targets are remembered, this will default to the caster.')
    );
}

extend('MechanicRememberTargets', 'Component');

function MechanicRememberTargets() {
    this.super('Remember Targets', Type.MECHANIC, false);

    this.description = 'Stores the current targets for later use under a specified key';

    this.data.push(new StringValue('Key', 'key', 'target')
        .setTooltip('The unique key to store the targets under. The "Remember" target will use this key to apply effects to the targets later on.')
    );
}

extend('MechanicRepeat', 'Component');

function MechanicRepeat() {
    this.super('Repeat', Type.MECHANIC, true);

    this.description = 'Applies child components multiple times. When it applies them is determined by the delay (seconds before the first application) and period (seconds between successive applications).';

    this.data.push(new AttributeValue('Repetitions', 'repetitions', 3, 0)
        .setTooltip('How many times to activate child components')
    );
    this.data.push(new DoubleValue('Period', 'period', 1)
        .setTooltip('The time in seconds between each time applying child components')
    );
    this.data.push(new DoubleValue('Delay', 'delay', 0)
        .setTooltip('The initial delay before starting to apply child components')
    );
    this.data.push(new ListValue('Stop on Fail', 'stop-on-fail', ['True', 'False'], 'False')
        .setTooltip('Whether to stop the repeat task early if the effects fail')
    );
}

extend('MechanicSound', 'Component');

function MechanicSound() {
    this.super('Sound', Type.MECHANIC, false);

    this.description = "Plays a sound at the target's location.";

    this.data.push(new ListValue('Sound', 'sound', [ 'Custom', ...getSounds() ], 'Ambient Cave')
        .setTooltip('The sound clip to play. Select \'Custom\' to enter custom sounds from your resource pack.')
    );
    this.data.push(new StringValue('Custom sound name', 'custom', 'myrp:some_sound')
		.requireValue('sound', ['Custom'])
        .setTooltip('Namespaced key of your custom sound.')
    );
    this.data.push(new AttributeValue('Volume', 'volume', 100, 0)
        .setTooltip('The volume of the sound as a percentage. Numbers above 100 will not get any louder, but will be heard from a farther distance')
    );
    this.data.push(new AttributeValue('Pitch', 'pitch', 1, 0)
        .setTooltip('The pitch of the sound as a numeric speed multiplier between 0.5 and 2.')
    );
}

extend('MechanicStat', 'Component');

function MechanicStat() {
    this.super('Stat', Type.MECHANIC, false);

    this.description = 'Gives a player bonus stat temporarily.';

    // this.data.push(new ListValue('Stat', 'key', ['health',
    //                                              'mana',
    //                                              'mana-regen',
    //                                              'physical-damage',
    //                                              'melee-damage',
    //                                              'projectile-damage',
    //                                              'physical-damage',
    //                                              'melee-defense',
    //                                              'projectile-defense',
    //                                              'skill-damage',
    //                                              'skill-defense',
    //                                              'move-speed',
    //                                              'attack-speed',
    //                                              'armor',
    //                                              'luck',
    //                                              'armor-toughness',
    //                                              'exp',
    //                                              'hunger',
    //                                              'hunger-heal',
    //                                              'cooldown',
    //                                              'knockback-resist'], 'health')
    //     .setTooltip('The name of the stat to add to')
    // );
    this.data.push(new StringValue('Stat', 'key', 'health')
        .setTooltip('The name of the stat to add to')
    );
    this.data.push(new ListValue('Operation', 'operation', ['ADD_NUMBER', 'MULTIPLY_PERCENTAGE'], 'ADD_NUMBER')
        .setTooltip('The operation on the original value by amount, ADD_NUMBER: Scalar adding, MULTIPLY_PERCENTAGE: Multiply the value by amount')
    );
    this.data.push(new AttributeValue('Amount', 'amount', 5, 2)
        .setTooltip('The amount to use with the operation')
    );
    this.data.push(new AttributeValue('Seconds', 'seconds', 3, 0)
        .setTooltip('How long in seconds to give the stat to the player')
    );
    this.data.push(new ListValue('Stackable', 'stackable', ['True', 'False'], 'False')
        .setTooltip('Whether applying multiple times stacks the effects')
    );
}

extend('MechanicStatus', 'Component');

function MechanicStatus() {
    this.super('Status', Type.MECHANIC, false);

    this.description = 'Applies a status effect to the target for a duration.';

    this.data.push(new ListValue('Status', 'status', ['Absorb',
                                                      'Curse',
                                                      'Disarm',
                                                      'Invincible',
                                                      'Root',
                                                      'Silence',
                                                      'Stun'], 'Stun')
        .setTooltip('The status to apply')
    );
    this.data.push(new AttributeValue('Duration', 'duration', 3, 1)
        .setTooltip('How long in seconds to apply the status')
    );
}

extend('MechanicTaunt', 'Component');

function MechanicTaunt() {
    this.super('Taunt', Type.MECHANIC, false);

    this.description = 'Draws aggro of targeted creatures. Regular mobs are set to attack the caster. The Spigot/Bukkit API for this was not functional on older versions, so it may not work on older servers. For MythicMobs, this uses their aggro system using the amount chosen below.';

    this.data.push(new AttributeValue('Amount', 'amount', 1, 0)
        .setTooltip('The amount of aggro to apply if MythicMobs is active. Use negative amounts to reduce aggro')
    );
}

extend('MechanicTrigger', 'Component');

function MechanicTrigger() {
    this.super('Trigger', Type.MECHANIC, true);

    this.description = 'Listens for a trigger on the current targets for a duration.';

    this.data.push(new ListValue('Trigger', 'trigger', ['Block Break',
                                                        'Block Place', 
                                                        'Crouch',
                                                        'Death',
                                                        'Drop Item',
                                                        'Environment Damage',
                                                        'Fishing',
                                                        'Fishing Bite',
                                                        'Fishing Fail',
                                                        'Fishing Grab',
                                                        'Fishing Ground',
                                                        'Fishing Reel',
                                                        'Item Swap',
                                                        'Kill',
                                                        'Land',
                                                        'Launch',
                                                        'Left Click',
                                                        'Move',
                                                        'Physical Damage',
                                                        'Right Click',
                                                        'Skill Damage',
                                                        'Took Physical Damage',
                                                        'Took Skill Damage'], 'Death')
        .setTooltip('The trigger to listen for')
    );
    this.data.push(new AttributeValue('Duration', 'duration', 5, 0)
        .setTooltip('How long to listen to the trigger for')
    );
    this.data.push(new ListValue('Stackable', 'stackable', ['True', 'False',], 'True')
        .setTooltip('Whether different players (or the same player) can listen to the same target at the same time')
    );
    this.data.push(new ListValue('Once', 'once', ['True', 'False'], 'True')
        .setTooltip('Whether the trigger should only be used once each cast. When false, the trigger can execute as many times as it happens for the duration.')
    );

    //BLOCK
    var blockTriggers = ['Block Break', 'Block Place'];
    this.data.push(new MultiListValue('Material', 'material', getAnyMaterials, ['Any'])
        .requireValue('trigger', blockTriggers)
        .setTooltip('The type of block expected to be handled')
    );

    this.data.push(new IntValue('Data', 'data', -1)
        .requireValue('trigger', blockTriggers)
        .setTooltip('The expected data value of the block (-1 for any data value)')
    );

    //CLICK
    var clickTriggers = ['Left Click', 'Right Click'];
    this.data.push(new ListValue('Crouch', 'crouch', ['Crouch', 'Dont crouch', 'Both'], 'Crouch')
        .requireValue('trigger', clickTriggers)
        .setTooltip('If the player has to be crouching in order for this trigger to function')
    );

    // CROUCH
    this.data.push(new ListValue('Type', 'type', ['Start Crouching', 'Stop Crouching', 'Both'], 'Start Crouching')
        .requireValue('trigger', ['Crouch'])
        .setTooltip('Whether you want to apply components when crouching or not crouching')
    );

    //DROP_ITEM
    this.data.push(new ListValue('Drop multiple', 'drop multiple', ['True', 'False', 'Ignore'], 'Ignore')
        .requireValue('trigger', ['Drop Item'])
        .setTooltip('Whether the player has to drop multiple items or a single item')
    );

    // ENVIRONMENT_DAMAGE
    this.data.push(new ListValue('Type', 'type', getDamageTypes, 'FALL')
        .requireValue('trigger', ['Environment Damage'])
        .setTooltip('The source of damage to apply for')
    );

    //ITEM_SWAP
    this.data.push(new ListValue('Cancel swap', 'cancel', ['True', 'False'], 'True')
        .requireValue('trigger', ['Item Swap'])
        .setTooltip('True cancels the item swap. False allows the item swap'));

    // LAND
    this.data.push(new DoubleValue('Min Distance', 'min-distance', 0)
        .requireValue('trigger', ['Land'])
        .setTooltip('The minimum distance the player should fall before effects activating.')
    );

    // LAUNCH
    this.data.push(new ListValue('Type', 'type', ['Any',
                                                  'Arrow',
                                                  'Egg',
                                                  'Ender Pearl',
                                                  'Fireball',
                                                  'Fishing Hook',
                                                  'Snowball'], 'Any')
        .requireValue('trigger', ['Launch'])
        .setTooltip('The type of projectile that should be launched.')
    );

    // PHYSICAL
    this.data.push(new ListValue('Type', 'type', ['Both', 'Melee', 'Projectile'], 'Both')
        .requireValue('trigger', ['Physical Damage', 'Took Physical Damage'])
        .setTooltip('The type of damage dealt')
    );

    // SKILL
    this.data.push(new StringValue('Category', 'category', '')
        .requireValue('trigger', ['Skill Damage', 'Took Skill Damage'])
        .setTooltip('The type of skill damage to apply for. Leave this empty to apply to all skill damage.')
    );

    // DAMAGE
    var damageTriggers = ['Physical Damage', 'Skill Damage', 'Took Physical Damage', 'Took Skill Damage'];
    this.data.push(new ListValue('Target Listen Target', 'target', ['True', 'False'], 'True')
        .requireValue('trigger', damageTriggers)
        .setTooltip('True makes children target the target that has been listened to. False makes children target the entity fighting the target entity.')
    );
    this.data.push(new DoubleValue("Min Damage", "dmg-min", 0)
        .requireValue('trigger', damageTriggers)
        .setTooltip('The minimum damage that needs to be dealt')
    );
    this.data.push(new DoubleValue("Max Damage", "dmg-max", 999)
        .requireValue('trigger', damageTriggers)
        .setTooltip('The maximum damage that needs to be dealt')
    );
}

extend('MechanicValueAdd', 'Component');

function MechanicValueAdd() {
    this.super('Value Add', Type.MECHANIC, false);

    this.description = 'Adds to a stored value under a unique key for the caster. If the value wasn\'t set before, this will set the value to the given amount.';

    this.data.push(new StringValue('Key', 'key', 'value')
        .setTooltip('The unique key to store the value under. This key can be used in place of attribute values to use the stored value.')
    );
    this.data.push(new AttributeValue('Amount', 'amount', 1, 0)
        .setTooltip('The amount to add to the value')
    );
}

extend('MechanicValueAttribute', 'Component');

function MechanicValueAttribute() {
    this.super('Value Attribute', Type.MECHANIC, false);

    this.description = 'Loads a player\'s attribute count for a specific attribute as a stored value to be used in other mechanics.';

    this.data.push(new StringValue('Key', 'key', 'attribute')
        .setTooltip('The unique key to store the value under. This key can be used in place of attribute values to use the stored value.')
    );
    this.data.push(new StringValue('Attribute', 'attribute', 'Vitality')
        .setTooltip('The name of the attribute you are loading the value of')
    );
}

extend('MechanicValueCopy', 'Component');

function MechanicValueCopy() {
    this.super('Value Copy', Type.MECHANIC, false);

    this.description = 'Copies a stored value from the caster to the target or vice versa';

    this.data.push(new StringValue('Key', 'key', 'value')
        .setTooltip('The unique key to store the value under. This key can be used in place of attribute values to use the stored value.')
    );
    this.data.push(new StringValue('Destination', 'destination', 'value')
        .setTooltip('The key to copy the original value to')
    );
    this.data.push(new ListValue('To target', 'to-target', ['True', 'False'], 'True')
        .setTooltip('The amount to add to the value')
    );
}

extend('MechanicValueDistance', 'Component');

function MechanicValueDistance() {
    this.super('Value Distance', Type.MECHANIC, false);

    this.description = 'Stores the distance between the target and the caster into a value';

    this.data.push(new StringValue('Key', 'key', 'attribute')
        .setTooltip('The unique key to store the value under. This key can be used in place of attribute values to use the stored value.')
    );
}

extend('MechanicValueHealth', 'Component');

function MechanicValueHealth() {
    this.super('Value Health', Type.MECHANIC, false);

    this.description = 'Stores the target\'s current health as a value under a given key for the caster';

    this.data.push(new StringValue('Key', 'key', 'value')
        .setTooltip('The unique key to store the value under. This key can be used in place of attribute values to use the stored value.')
    );
    this.data.push(new ListValue('Type', 'type', ['Current', 'Max', 'Missing', 'Percent'], 'Current')
        .setTooltip('Current provides the health the target has, max provides their total health, missing provides how much health they have lost, and percent is the ratio of health to total health.')
    );
}

extend('MechanicValueLocation', 'Component');

function MechanicValueLocation() {
    this.super('Value Location', Type.MECHANIC, false);

    this.description = 'Loads the first target\'s current location into a stored value for use at a later time.';

    this.data.push(new StringValue('Key', 'key', 'location')
        .setTooltip('The unique key to store the location under. This key can be used in place of attribute values to use the stored value.')
    );
}

extend('MechanicValueLore', 'Component');

function MechanicValueLore() {
    this.super('Value Lore', Type.MECHANIC, false);

    this.description = 'Loads a value from a held item\'s lore into a stored value under the given unique key for the caster.';

    this.data.push(new StringValue('Key', 'key', 'lore')
        .setTooltip('The unique key to store the value under. This key can be used in place of attribute values to use the stored value.')
    );
    this.data.push(new ListValue("Hand", "hand", ['Main', 'Offhand'], 'Main')
        .setTooltip('The hand to check for the item. Offhand items are MC 1.9+ only.')
    );
    this.data.push(new StringValue('Regex', 'regex', 'Damage: {value}')
        .setTooltip('The regex string to look for, using {value} as the number to store. If you do not know about regex, consider looking it up on Wikipedia or avoid using major characters such as [ ] { } ( ) . + ? * ^ \\ |')
    );
    this.data.push(new AttributeValue('Multiplier', 'multiplier', 1, 0)
        .setTooltip('The multiplier for the acquired value. If you want the value to remain unchanged, leave this value at 1.')
    );
}

extend('MechanicValueLoreSlot', 'Component');

function MechanicValueLoreSlot() {
    this.super('Value Lore Slot', Type.MECHANIC, false);

    this.description = 'Loads a value from an item\'s lore into a stored value under the given unique key for the caster.';

    this.data.push(new StringValue('Key', 'key', 'lore')
        .setTooltip('The unique key to store the value under. This key can be used in place of attribute values to use the stored value.')
    );
    this.data.push(new IntValue("Slot", "slot", 9)
        .setTooltip('The slot of the inventory to fetch the item from. Slots 0-8 are the hotbar, 9-35 are the main inventory, 36-39 are armor, and 40 is the offhand slot.')
    );
    this.data.push(new StringValue('Regex', 'regex', 'Damage: {value}')
        .setTooltip('The regex string to look for, using {value} as the number to store. If you do not know about regex, consider looking it up on Wikipedia or avoid using major characters such as [ ] { } ( ) . + ? * ^ \\ |')
    );
    this.data.push(new AttributeValue('Multiplier', 'multiplier', 1, 0)
        .setTooltip('The multiplier for the acquired value. If you want the value to remain unchanged, leave this value at 1.')
    );
}

extend('MechanicValueMana', 'Component');

function MechanicValueMana() {
    this.super('Value Mana', Type.MECHANIC, false);

    this.description = 'Stores the target player\'s current mana as a value under a given key for the caster';

    this.data.push(new StringValue('Key', 'key', 'value')
        .setTooltip('The unique key to store the value under. This key can be used in place of attribute values to use the stored value.')
    );
    this.data.push(new ListValue('Type', 'type', ['Current', 'Max', 'Missing', 'Percent'], 'Current')
        .setTooltip('Current provides the mana the target has, max provides their total mana, missing provides how much mana they have lost, and percent is the ratio of health to total mana.')
    );
}

extend('MechanicValueMultiply', 'Component');

function MechanicValueMultiply() {
    this.super('Value Multiply', Type.MECHANIC, false);

    this.description = 'Multiplies a stored value under a unique key for the caster. If the value wasn\'t set before, this will not do anything.';

    this.data.push(new StringValue('Key', 'key', 'value')
        .setTooltip('The unique key to store the value under. This key can be used in place of attribute values to use the stored value.')
    );
    this.data.push(new AttributeValue('Multiplier', 'multiplier', 1, 0)
        .setTooltip('The amount to multiply the value by')
    );
}

extend('MechanicValuePlaceholder', 'Component');

function MechanicValuePlaceholder() {
    this.super('Value Placeholder', Type.MECHANIC, false);

    this.description = 'Uses a placeholder string and stores it as a value for the caster';

    this.data.push(new StringValue('Key', 'key', 'value')
        .setTooltip('The unique key to store the value under. This key can be used in place of attribute values to use the stored value.')
    );
    this.data.push(new ListValue("Type", "type", ['Number', 'String'], 'Number')
        .setTooltip('The type of value to store. Number values require numeric placeholders. String values can be used in messages or commands.')
    );
    this.data.push(new StringValue('Placeholder', 'placeholder', '%player_food_level%')
        .setTooltip('The placeholder string to use. Can contain multiple placeholders if using the String type.')
    );
}

extend('MechanicValueRandom', 'Component')

function MechanicValueRandom() {
    this.super('Value Random', Type.MECHANIC, false);

    this.description = 'Stores a specified value under a given key for the caster.';

    this.data.push(new StringValue('Key', 'key', 'value')
        .setTooltip('The unique key to store the value under. This key can be used in place of attribute values to use the stored value.')
    );
    this.data.push(new ListValue('Type', 'type', ['Normal', 'Triangular'], 'Normal')
        .setTooltip('The type of random to use. Triangular favors numbers in the middle, similar to rolling two dice.')
    );
    this.data.push(new AttributeValue('Min', 'min', 0, 0)
        .setTooltip('The minimum value it can be')
    );
    this.data.push(new AttributeValue('Max', 'max', 0, 0)
        .setTooltip('The maximum value it can be')
    );
}

extend('MechanicValueSet', 'Component');

function MechanicValueSet() {
    this.super('Value Set', Type.MECHANIC, false);

    this.description = 'Stores a specified value under a given key for the caster.';

    this.data.push(new StringValue('Key', 'key', 'value')
        .setTooltip('The unique key to store the value under. This key can be used in place of attribute values to use the stored value.')
    );
    this.data.push(new AttributeValue('Value', 'value', 1, 0)
        .setTooltip('The value to store under the key')
    );
}

extend('MechanicWarp', 'Component');

function MechanicWarp() {
    this.super('Warp', Type.MECHANIC, false);

    this.description = 'Warps the target relative to their forward direction. Use negative numbers to go in the opposite direction (e.g. negative forward will cause the target to warp backwards).';

    this.data.push(new ListValue('Through Walls', 'walls', ['True', 'False'], 'False')
        .setTooltip('Whether to allow the target to teleport through walls')
    );
    this.data.push(new SectionMarker('Position'));
    this.data.push(new AttributeValue('Forward', 'forward', 3, 1)
        .setTooltip('How far forward in blocks to teleport. A negative value teleports backwards.')
    );
    this.data.push(new AttributeValue('Upward', 'upward', 0, 0)
        .setTooltip('How far upward in blocks to teleport. A negative value teleports downward.')
    );
    this.data.push(new AttributeValue('Right', 'right', 0, 0)
        .setTooltip('How far to the right in blocks to teleport. A negative value teleports to the left.')
    );
}

extend('MechanicWarpLoc', 'Component');

function MechanicWarpLoc() {
    this.super('Warp Location', Type.MECHANIC, false);

    this.description = 'Warps the target to a specified location.';

    this.data.push(new StringValue('World (or "current")', 'world', 'current')
        .setTooltip('The name of the world that the location is in')
    );
    this.data.push(new DoubleValue('X', 'x', 0)
        .setTooltip('The X-coordinate of the desired position')
    );
    this.data.push(new DoubleValue('Y', 'y', 0)
        .setTooltip('The Y-coordinate of the desired position')
    );
    this.data.push(new DoubleValue('Z', 'z', 0)
        .setTooltip('The Z-coordinate of the desired position')
    );
    this.data.push(new DoubleValue('Yaw', 'yaw', 0)
        .setTooltip('The Yaw of the desired position (left/right orientation)')
    );
    this.data.push(new DoubleValue('Pitch', 'pitch', 0)
        .setTooltip('The Pitch of the desired position (up/down orientation)')
    );
}

extend('MechanicWarpRandom', 'Component');

function MechanicWarpRandom() {
    this.super('Warp Random', Type.MECHANIC, false);

    this.description = 'Warps the target in a random direction the given distance.';

    this.data.push(new ListValue('Only Horizontal', 'horizontal', ['True', 'False'], 'True')
        .setTooltip('Whether to limit the random position to the horizontal plane')
    );
    this.data.push(new ListValue('Through Walls', 'walls', ['True', 'False'], 'False')
        .setTooltip('Whether to allow the target to teleport through walls')
    );
    this.data.push(new AttributeValue('Distance', 'distance', 3, 1)
        .setTooltip('The max distance in blocks to teleport')
    );
}

extend('MechanicWarpSwap', 'Component');

function MechanicWarpSwap() {
    this.super('Warp Swap', Type.MECHANIC, false);

    this.description = 'Switches the location of the caster and the target. If multiple targets are provided, this takes the first one.';
}

extend('MechanicWarpTarget', 'Component');

function MechanicWarpTarget() {
    this.super('Warp Target', Type.MECHANIC, false);

    this.description = 'Warps either the target or the caster to the other. This does nothing when the target is the caster.';

    this.data.push(new ListValue('Type', 'type', ['Caster to Target', 'Target to Caster'], 'Caster to Target')
        .setTooltip('The direction to warp the involved targets')
    );
}

extend('MechanicWarpValue', 'Component');

function MechanicWarpValue() {
    this.super('Warp Value', Type.MECHANIC, false);

    this.description = 'Warps all targets to a location remembered using the Value Location mechanic.';

    this.data.push(new StringValue('Key', 'key', 'location')
        .setTooltip('The unique key the location is stored under. This should be the same key used in the Value Location mechanic.')
    );
}

extend('MechanicWolf', 'Component');

function MechanicWolf() {
    this.super('Wolf', Type.MECHANIC, true);

    this.description = 'Summons a wolf on each target for a duration. Child components will start off targeting the wolf so you can add effects to it. You can also give it its own skillset, though Cast triggers will not occur.';

    this.data.push(new ListValue('Collar Color', 'color', getDyes(), 'Black')
        .setTooltip('The color of the collar that the wolf should wear')
    );
    this.data.push(new StringValue('Wolf Name', 'name', "{player}'s Wolf")
        .setTooltip('The displayed name of the wolf. Use {player} to embed the caster\'s name.')
    );
    this.data.push(new AttributeValue('Health', 'health', 10, 0)
        .setTooltip('The starting health of the wolf')
    );
    this.data.push(new AttributeValue('Damage', 'damage', 3, 0)
        .setTooltip('The damage dealt by the wolf each attack')
    );
    this.data.push(new ListValue('Sitting', 'sitting', ['True', 'False'], 'False')
        .setTooltip('Whether the wolf starts off sitting')
    );
    this.data.push(new AttributeValue('Duration', 'seconds', 10, 0)
        .setTooltip('How long to summon the wolf for')
    );
    this.data.push(new AttributeValue('Amount', 'amount', 1, 0)
        .setTooltip('How many wolves to summon')
    );
    this.data.push(new StringListValue('Skills (one per line)', 'skills', [])
        .setTooltip('The skills to give the wolf. Skills are executed at the level of the skill summoning the wolf. Skills needing a Cast trigger will not work.')
    );
}

// The active component being edited or added to
var activeComponent = undefined;

/**
 * Adds the options for item related effects to the component
 *
 * @param {Component} component - the component to add to
 */
function addItemOptions(component) {

    component.data.push(new SectionMarker('Item Options'));
    component.data.push(new ListValue('Material', 'material', getMaterials, 'Arrow')
        .setTooltip('The type of item to give to the player')
    );
    component.data.push(new IntValue('Amount', 'amount', 1)
        .setTooltip('The quantity of the item to give to the player')
    );
    component.data.push(new IntValue('Durability', 'data', 0).requireValue('material', getDamageableMaterials())
        .setTooltip('The durability to reduce from the item')
    );
    component.data.push(new ListValue('Unbreakable', 'unbreakable', ['True', 'False'], 'False').requireValue('material', getDamageableMaterials())
        .setTooltip('Whether to make the item unbreakable')
    );
    component.data.push(new IntValue('CustomModelData', 'byte', 0)
        .setTooltip('The CustomModelData of the item')
    );
	component.data.push(new MultiListValue('Hide Flags', 'hide-flags', ['Enchants', 'Attributes', 'Unbreakable', 'Destroys', 'Placed on', 'Potion effects', 'Dye'], [])
        .setTooltip('Flags to hide from the item')
    );
    component.data.push(new ListValue('Custom Name/Lore', 'custom', ['True', 'False'], 'False')
        .setTooltip('Whether to apply a custom name/lore to the item')
    );

    component.data.push(new StringValue('Name', 'name', 'Name').requireValue('custom', ['True'])
        .setTooltip('The name of the item')
    );
    component.data.push(new StringListValue('Lore', 'lore', []).requireValue('custom', ['True'])
        .setTooltip('The lore text for the item (the text below the name)')
    );
    component.data.push(new StringValue('Potion Color', 'potion_color', '#385dc6').requireValue('material', ['Potion',
                                                                                                        'Splash potion', 'Lingering potion'])
        .setTooltip('The potion color in hex RGB')
    );
    component.data.push(new ListValue('Potion Type', 'potion_type', getPotionTypes, 'Speed').requireValue('material', ['Potion',
                                                                                                                  'Splash potion', 'Lingering potion'])
        .setTooltip('The type of potion')
    );
    component.data.push(new IntValue('Potion Level', 'potion_level', 0).requireValue('material', ['Potion', 'Splash potion', 'Lingering potion'])
        .setTooltip('The potion level')
    );
    component.data.push(new IntValue('Potion Duration', 'potion_duration', 30).requireValue('material', ['Potion',
                                                                                                    'Splash potion', 'Lingering potion'])
        .setTooltip('The potion duration (seconds)')
    );
    component.data.push(new StringValue('Armor Color', 'armor_color', '#a06540').requireValue('material', ['Leather helmet', 'Leather chestplate', 'Leather leggings', 'Leather boots'])
        .setTooltip('The armor color in hex RGB')
    );
}

/**
 * Adds the options for item-check related effects to the component
 *
 * @param {Component} component - the component to add to
 */
function addItemConditionOptions(component) {

    component.data.push(new ListValue('Check Material', 'check-mat', ['True', 'False'], 'True')
        .setTooltip('Whether the item needs to be a certain type')
    );
    component.data.push(new ListValue('Material', 'material', getMaterials, 'Arrow')
        .requireValue('check-mat', ['True'])
        .setTooltip('The type the item needs to be')
    );

    component.data.push(new ListValue('Check Data', 'check-data', ['True', 'False'], 'False')
        .setTooltip('Whether the item needs to have a certain data value')
    );
    component.data.push(new IntValue('Data', 'data', 0)
        .requireValue('check-data', ['True'])
        .setTooltip('The data value the item must have')
    );

    component.data.push(new ListValue('Check Lore', 'check-lore', ['True', 'False'], 'False')
        .setTooltip('Whether the item requires a bit of text in its lore')
    );
    component.data.push(new StringValue('Lore', 'lore', 'text')
        .requireValue('check-lore', ['True'])
        .setTooltip('The text the item requires in its lore')
    );

    component.data.push(new ListValue('Check Name', 'check-name', ['True', 'False'], 'False')
        .setTooltip('Whether the item needs to have a bit of text in its display name')
    );
    component.data.push(new StringValue('Name', 'name', 'name')
        .requireValue('check-name', ['True'])
        .setTooltip('The text the item requires in its display name')
    );

    component.data.push(new ListValue('Regex', 'regex', ['True', 'False'], 'False')
        .setTooltip('Whether the name and lore checks are regex strings. If you do not know what regex is, leave this option alone.')
    );
}

function addProjectileOptions(component) {
    component.data.push(new SectionMarker('Projectile Options'));

    // General data
    component.data.push(new AttributeValue('Velocity', 'velocity', 3, 0)
        .setTooltip('How fast the projectile is launched. A negative value fires it in the opposite direction.')
    );
    component.data.push(new AttributeValue('Lifespan', 'lifespan', 5, 0)
        .setTooltip('How long in secods before the projectile will expire in case it doesn\'t hit anything.')
    );
    component.data.push(new ListValue('Spread', 'spread', ['Cone', 'Horizontal Cone', 'Rain'], 'Cone')
        .setTooltip('The orientation for firing projectiles. Cone will fire arrows in a cone centered on your reticle. Horizontal cone does the same as cone, just locked to the XZ axis (parallel to the ground). Rain drops the projectiles from above the target. For firing one arrow straight, use "Cone"')
    );
    component.data.push(new AttributeValue('Amount', 'amount', 1, 0)
        .setTooltip('The number of projectiles to fire')
    );

    // Cone values
    component.data.push(new AttributeValue('Angle', 'angle', 30, 0)
        .requireValue('spread', ['Cone', 'Horizontal Cone'])
        .setTooltip('The angle in degrees of the cone arc to spread projectiles over. If you are only firing one projectile, this does not matter.')
    );

    // Rain values
    component.data.push(new AttributeValue('Height', 'height', 8, 0)
        .requireValue('spread', ['Rain'])
        .setTooltip('The distance in blocks over the target to rain the projectiles from')
    );
    component.data.push(new AttributeValue('Radius', 'rain-radius', 2, 0)
        .requireValue('spread', ['Rain'])
        .setTooltip('The radius of the rain emission area in blocks')
    );

    // Offsets
    component.data.push(new SectionMarker('Offset'));
    component.data.push(new AttributeValue('Forward Offset', 'forward', 0, 0)
        .setTooltip('How far forward in front of the target the projectile should fire from in blocks. A negative value will put it behind.')
    );
    component.data.push(new AttributeValue('Upward Offset', 'upward', 0, 0)
        .setTooltip('How far above the target the projectile should fire from in blocks. A negative value will put it below.')
    );
    component.data.push(new AttributeValue('Right Offset', 'right', 0, 0)
        .setTooltip('How far to the right of the target the projectile should fire from. A negative value will put it to the left.')
    );
}

/**
 * Adds the options for particle effects to the components
 *
 * @param {Component} component - the component to add to
 */
function addParticleOptions(component) {
    component.data.push(new SectionMarker('Particle Options'));
    component.data.push(new ListValue('Particle', 'particle', getParticles, 'Villager happy')
        .setTooltip('The type of particle to display')
    );

    component.data.push(new ListValue('Material', 'material', getMaterials, 'Dirt').requireValue('particle', ['Item crack',
                                                                                                              'Block crack',
                                                                                                              'Block dust',
                                                                                                              'Falling dust',
                                                                                                              'Block marker'])
        .setTooltip('The material to use for the particles')
    );
    component.data.push(new IntValue('Durability', 'durability', 0).requireValue('particle', ['Item crack'])
        .setTooltip('The durability to be reduced from the item used to make the particles')
    );
    component.data.push(new IntValue('CustomModelData', 'type', 0).requireValue('particle', ['Item crack'])
        .setTooltip('The CustomModelData of the item used to make the particles')
    );
    component.data.push(new StringValue('Dust Color', 'dust-color', '#FF0000').requireValue('particle', ['Redstone', 'Dust color transition'])
        .setTooltip('The color of the dust particles in hex RGB')
    );
    component.data.push(new StringValue('Final Dust Color', 'final-dust-color', '#FF0000').requireValue('particle', ['Dust color transition'])
        .setTooltip('The color to transition to, in hex RGB')
    );
    component.data.push(new DoubleValue('Dust Size', 'dust-size', 1).requireValue('particle', ['Redstone', 'Dust color transition'])
        .setTooltip('The size of the dust particles')
    );

    component.data.push(new ListValue('Arrangement', 'arrangement', ['Sphere', 'Circle', 'Hemisphere'], 'Sphere')
        .setTooltip('The arrangement to use for the particles. Circle is a 2D circle, Hemisphere is half a 3D sphere, and Sphere is a 3D sphere')
    );
    // Circle arrangement direction
    component.data.push(new ListValue('Circle Direction', 'direction', ['XY',
                                                                        'XZ',
                                                                        'YZ'], 'XZ').requireValue('arrangement', ['Circle'])
        .setTooltip('The orientation of the circle. XY and YZ are vertical circles while XZ is a horizontal circle.')
    );
    component.data.push(new AttributeValue('Radius', 'radius', 1, 0)
        .setTooltip('The radius of the arrangement in blocks')
    );
    component.data.push(new AttributeValue('Points', 'particles', 20, 0)
        .setTooltip('The amount of points that conform the chosen arrangement')
    );

    // Bukkit particle data value
    component.data.push(new IntValue('Effect Data', 'data', 0).requireValue('particle', ['Smoke',
                                                                                         'Ender Signal',
                                                                                         'Mobspawner Flames',
                                                                                         'Potion Break'])
        .setTooltip('The data value to use for the particle. The effect changes between particles such as the orientation for smoke particles or the color for potion break')
    );
    component.data.push(new IntValue('Visible Radius', 'visible-radius', 25).setTooltip('How far away players can see the particles from in blocks')
    );
    component.data.push(new DoubleValue('DX', 'dx', 0).setTooltip('Offset in the X direction, used as the Red value for some particles.')
    );
    component.data.push(new DoubleValue('DY', 'dy', 0).setTooltip('Offset in the Y direction, used as the Green value for some particles.')
    );
    component.data.push(new DoubleValue('DZ', 'dz', 0).setTooltip('Offset in the Z direction, used as the Blue value for some particles.')
    );
    component.data.push(new DoubleValue('Amount', 'amount', 1).setTooltip('Number of particles to play per point. For "Spell mob" and "Spell mob ambient" particles, set to 0 to control the particle color.')
    );
    component.data.push(new DoubleValue('Speed', 'speed', 0.1).setTooltip('Speed of the particle. For some particles controls other parameters, such as size.')
    );
}

function addEffectOptions(component, optional) {
    component.data.push(new SectionMarker('Particle Effect Options'));
    var opt = appendNone;
    if (optional) {
        opt = appendOptional;

        component.data.push(new ListValue('Use Effect', 'use-effect', ['True', 'False'], 'False')
            .setTooltip('Whether to use a particle effect.')
        );
    }

    component.data.push(opt(new StringValue('Effect Key', 'effect-key', 'default')
        .setTooltip('The key to refer to the effect by. Only one effect of each key can be active at a time.')
    ));
    component.data.push(opt(new AttributeValue('Duration', 'duration', 1, 0)
        .setTooltip('The time to play the effect for in seconds')
    ));

    component.data.push(opt(new StringValue('Shape', '-shape', 'hexagon')
        .setTooltip('Key of a formula for deciding where particles are played each iteration. View "effects.yml" for a list of defined formulas and their keys.')
    ));
    component.data.push(opt(new ListValue('Shape Direction', '-shape-dir', ['XY', 'YZ', 'XZ'], 'XY')
        .setTooltip('The plane the shape formula applies to. XZ would be flat, the other two are vertical.')
    ));
    component.data.push(opt(new StringValue('Shape Size', '-shape-size', '1')
        .setTooltip('Formula for deciding the size of the shape. This can be any sort of formula using the operations defined in the wiki.')
    ));
    component.data.push(opt(new StringValue('Animation', '-animation', 'one-circle')
        .setTooltip('Key of a formula for deciding where the particle effect moves relative to the target. View "effects.yml" for a list of defined formulas and their keys.')
    ));
    component.data.push(opt(new ListValue('Animation Direction', '-anim-dir', ['XY', 'YZ', 'XZ'], 'XZ')
        .setTooltip('The plane the animation motion moves through. XZ wold be flat, the other two are vertical.')
    ));
    component.data.push(opt(new StringValue('Animation Size', '-anim-size', '1')
        .setTooltip('Formula for deciding the multiplier of the animation distance. This can be any sort of formula using the operations defined in the wiki.')
    ));
    component.data.push(opt(new IntValue('Interval', '-interval', 1)
        .setTooltip('Number of ticks between playing particles.')
    ));
    component.data.push(opt(new IntValue('View Range', '-view-range', 25)
        .setTooltip('How far away the effect can be seen from.')
    ));

    component.data.push(opt(new ListValue('Particle', '-particle-type', getParticles, 'Villager happy')
        .setTooltip('The type of particle to use.')
    ));
    component.data.push(opt(new ListValue('Material', '-particle-material', getMaterials, 'Dirt')
        .requireValue('-particle-type', ['Item crack', 'Block crack', 'Block dust', 'Falling dust', 'Block marker'])
        .setTooltip('The material to use for the particle.')
    ));
    component.data.push(opt(new IntValue('Durability', '-particle-durability', 0)
		.requireValue('particle', ['Item crack'])
        .setTooltip('The durability to be reduced from the item used to make the particles')
    ));
    component.data.push(opt(new IntValue('CustomModelData', '-particle-data', 0)
        .requireValue('-particle-type', ['Item crack'])
        .setTooltip('The data value for the material used by the particle. For 1.14+ determines the CustomModelData of the item.')
    ));
    component.data.push(new StringValue('Dust Color', '-particle-dust-color', '#FF0000').requireValue('-particle-type', ['Redstone', 'Dust color transition'])
        .setTooltip('The color of the dust particles in hex RGB')
    );
    component.data.push(new StringValue('Final Dust Color', '-particle-final-dust-color', '#FF0000').requireValue('-particle-type', ['Dust color transition'])
        .setTooltip('The color to transition to, in hex RGB')
    );
    component.data.push(new DoubleValue('Dust Size', '-particle-dust-size', 1).requireValue('-particle-type', ['Redstone', 'Dust color transition'])
        .setTooltip('The size of the dust particles')
    );
    component.data.push(opt(new IntValue('Amount', '-particle-amount', 1)
        .setTooltip('Number of particles to play per point. For "Spell mob" and "Spell mob ambient" particles, set to 0 to control the particle color.')
    ));
    component.data.push(opt(new DoubleValue('DX', '-particle-dx', 0)
        .setTooltip('Offset in the X direction, used as the Red value for some particles.')
    ));
    component.data.push(opt(new DoubleValue('DY', '-particle-dy', 0)
        .setTooltip('Offset in the Y direction, used as the Green value for some particles.')
    ));
    component.data.push(opt(new DoubleValue('DZ', '-particle-dz', 0)
        .setTooltip('Offset in the Z direction, used as the Blue value for some particles.')
    ));
    component.data.push(opt(new DoubleValue('Speed', '-particle-speed', 0.1)
        .setTooltip('Speed of the particle. For some particles controls other parameters, such as size.')
    ));
    component.data.push(opt(new DoubleValue('Initial Rotation', '-initial-rotation', 0)
        .setTooltip('The amount to rotate the effect (useful for effects like the square).')
    ));
    component.data.push(opt(new ListValue('Rotate w/ Player', '-with-rotation', ['True', 'False'], 'True')
        .setTooltip('Whether to follow the rotation of the player for the effect.')
    ));
}

function addTargetOptions(component) {
    component.data.push(new ListValue("Group", "group", ["Ally", "Enemy", "Both"], "Enemy")
        .setTooltip('The alignment of targets to get')
    );
    component.data.push(new ListValue("Through Wall", "wall", ['True', 'False'], 'False')
        .setTooltip('Whether to allow targets to be on the other side of a wall')
    );
    component.data.push(new ListValue("Include Caster", "caster", ['True', 'False', 'In area'], 'False')
        .setTooltip('Whether to include the caster in the target list. "True" will always include them, "False" will never, and "In area" will only if they are within the targeted area')
    );
    component.data.push(new AttributeValue("Max Targets", "max", 99, 0)
        .setTooltip('The max amount of targets to apply children to')
    );
}

function appendOptional(value) {
    value.requireValue('use-effect', ['True']);
    return value;
}

function appendNone(value) {
    return value;
}
