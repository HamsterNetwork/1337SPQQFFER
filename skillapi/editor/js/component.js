var hoverSpace;

var DAMAGE_TYPES = [ 'Block Explosion', 'Contact', 'Cramming', 'Dragon Breath', 'Drowning', 'Entity Attack', 'Entity Explosion', 'Fall', 'Falling Block', 'Fire', 'Fire Tick', 'Fly Into Wall', 'Hot Floor', 'Lava', 'Lightning', 'Magic', 'Melting', 'Poison', 'Projectile', 'Starvation', 'Suffocation', 'Suicide', 'Thorns', 'Void', 'Wither' ];

function canDrop(thing, target) {
    if (thing == target) return false;

    var temp = target;
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
    TRIGGER   : 'trigger',
    TARGET    : 'target',
    CONDITION : 'condition',
    MECHANIC  : 'mechanic'
};

/**
 * Available triggers for activating skill effects
 */
var Trigger = {
    BLOCK_BREAK          : { name: '方块破坏',          container: true, construct: TriggerBlockBreak,        premium: true },
    BLOCK_PLACE          : { name: '方块放置',          container: true, construct: TriggerBlockPlace,        premium: true },
    CAST                 : { name: '主动释放',                 container: true, construct: TriggerCast               },
    CLEANUP              : { name: '技能清除',              container: true, construct: TriggerCleanup            },
    CROUCH               : { name: '下蹲',               container: true, construct: TriggerCrouch             },
    DEATH                : { name: '死亡',                container: true, construct: TriggerDeath              },
    ENVIRONMENT_DAMAGE   : { name: '环境伤害',   container: true, construct: TriggerEnvironmentDamage, premium: true },
    INITIALIZE           : { name: '复活',           container: true, construct: TriggerInitialize         },
    KILL                 : { name: '击杀',                 container: true, construct: TriggerKill               },
    LAND                 : { name: '落地',                 container: true, construct: TriggerLand               },
    LAUNCH               : { name: '射击',               container: true, construct: TriggerLaunch             },
    MOVE                 : { name: '移动',                 container: true, construct: TriggerMove,              premium: true },
    PHYSICAL_DAMAGE      : { name: '造成物理伤害',      container: true, construct: TriggerPhysicalDamage     },
    SKILL_DAMAGE         : { name: '造成技能伤害',         container: true, construct: TriggerSkillDamage        },
    TOOK_PHYSICAL_DAMAGE : { name: '受到到物理伤害', container: true, construct: TriggerTookPhysicalDamage },
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
    ARMOR:       { name: '装备',       container: true, construct: ConditionArmor      },
    ATTRIBUTE:   { name: '属性',   container: true, construct: ConditionAttribute  },
    BIOME:       { name: '生物群系',       container: true, construct: ConditionBiome      },
    BLOCK:       { name: '方块',       container: true, construct: ConditionBlock      },
    CEILING:     { name: '头上空间',     container: true, construct: ConditionCeiling,   premium: true },
    CHANCE:      { name: '几率',      container: true, construct: ConditionChance     },
    CLASS:       { name: '职业',       container: true, construct: ConditionClass      },
    CLASS_LEVEL: { name: '职业等级', container: true, construct: ConditionClassLevel },
    COMBAT:      { name: '战斗状态',      container: true, construct: ConditionCombat     },
    CROUCH:      { name: '下蹲',      container: true, construct: ConditionCrouch     },
    DIRECTION:   { name: '朝向',   container: true, construct: ConditionDirection  },
    ELEVATION:   { name: '高度',   container: true, construct: ConditionElevation  },
    ELSE:        { name: '或',        container: true, construct: ConditionElse,      premium: true },
    ENTITY_TYPE: { name: '实体类型', container: true, construct: ConditionEntityType,premium: true },
    FIRE:        { name: '燃烧',        container: true, construct: ConditionFire       },
    FLAG:        { name: '标记',        container: true, construct: ConditionFlag       },
    GROUND:      { name: '地面',      container: true, construct: ConditionGround,    premium: true },
    HEALTH:      { name: '血量',      container: true, construct: ConditionHealth     },
    INVENTORY:   { name: '背包物品',   container: true, construct: ConditionInventory  },
    ITEM:        { name: '手持物品',        container: true, construct: ConditionItem       },
    LIGHT:       { name: '亮度',       container: true, construct: ConditionLight      },
    MANA:        { name: '法力值',        container: true, construct: ConditionMana       },
    NAME:        { name: '名字',        container: true, construct: ConditionName       },
    OFFHAND:     { name: '副手',     container: true, construct: ConditionOffhand    },
    PERMISSION:  { name: '权限',  container: true, construct: ConditionPermission,premium: true },
    POTION:      { name: '药水效果',      container: true, construct: ConditionPotion     },
    SKILL_LEVEL: { name: '技能等级', container: true, construct: ConditionSkillLevel },
    SLOT:        { name: '槽位',        container: true, construct: ConditionSlot,      premium: true },
    STATUS:      { name: '状态',      container: true, construct: ConditionStatus     },
    TIME:        { name: '时间',        container: true, construct: ConditionTime       },
    TOOL:        { name: '工具',        container: true, construct: ConditionTool       },
    VALUE:       { name: '数值',       container: true, construct: ConditionValue      },
    WATER:       { name: '水',       container: true, construct: ConditionWater      },
    WEATHER:     { name: '天气',     container: true, construct: ConditionWeather,   premium: true }
};

/**
 * Available mechanic component data
 */
var Mechanic = {
    ATTRIBUTE:           { name: '属性加成',           container: false, construct: MechanicAttribute          },
    BLOCK:               { name: '生成方块',               container: false, construct: MechanicBlock              },
    BUFF:                { name: '战斗加成',                container: false, construct: MechanicBuff,              premium: true },
    CANCEL:              { name: '伤害取消',              container: false, construct: MechanicCancel             },
    CHANNEL:             { name: '吟唱',             container: true,  construct: MechanicChannel            },
    CLEANSE:             { name: '净化',             container: false, construct: MechanicCleanse            },
    COMMAND:             { name: '指令',             container: false, construct: MechanicCommand            },
    COOLDOWN:            { name: '冷却',            container: false, construct: MechanicCooldown           },
    DAMAGE:              { name: '造成伤害',              container: false, construct: MechanicDamage             },
    DAMAGE_BUFF:         { name: '伤害加成',         container: false, construct: MechanicDamageBuff         },
    DAMAGE_LORE:         { name: 'Lore伤害',         container: false, construct: MechanicDamageLore         },
    DEFENSE_BUFF:        { name: '伤害减免',        container: false, construct: MechanicDefenseBuff        },
    DELAY:               { name: '延迟',               container: true,  construct: MechanicDelay              },
    DISGUISE:            { name: '伪装',            container: false, construct: MechanicDisguise           },
    DURABILITY:          { name: '耐久度',          container: false, construct: MechanicDurability,        premium: true },
    EXPLOSION:           { name: '爆炸',           container: false, construct: MechanicExplosion          },
    FIRE:                { name: '燃烧',                container: false, construct: MechanicFire               },
    FLAG:                { name: '标记',                container: false, construct: MechanicFlag               },
    FLAG_CLEAR:          { name: '标记清除',          container: false, construct: MechanicFlagClear          },
    FLAG_TOGGLE:         { name: '标记切换',         container: false, construct: MechanicFlagToggle         },
    FOOD:                { name: '饱食度',                container: false, construct: MechanicFood,              premium: true },
    FORGET_TARGETS:      { name: '遗忘目标',      container: false, construct: MechanicForgetTargets,     premium: true },
    HEAL:                { name: '治疗',                container: false, construct: MechanicHeal               },
    HEALTH_SET:          { name: '生命值设置',          container: false, construct: MechanicHealthSet,         premium: true },
    HELD_ITEM:           { name: '移动手持物品',           container: false, construct: MechanicHeldItem,          premium: true },
    IMMUNITY:            { name: '伤害免疫',            container: false, construct: MechanicImmunity           },
    INTERRUPT:           { name: '中断',           container: false, construct: MechanicInterrupt          },
    ITEM:                { name: '给予物品',                container: false, construct: MechanicItem               },
    ITEM_PROJECTILE:     { name: '物品抛射',     container: true,  construct: MechanicItemProjectile     },
    ITEM_REMOVE:         { name: '物品移除',         container: false, construct: MechanicItemRemove         },
    LAUNCH:              { name: '冲刺',              container: false, construct: MechanicLaunch             },
    LIGHTNING:           { name: '闪电',           container: false, construct: MechanicLightning          },
    MANA:                { name: '法力值',                container: false, construct: MechanicMana               },
    MESSAGE:             { name: '聊天信息',             container: false, construct: MechanicMessage            },
    PARTICLE:            { name: '粒子',            container: false, construct: MechanicParticle           },
    PARTICLE_ANIMATION:  { name: '粒子动画',  container: false, construct: MechanicParticleAnimation  },
    PARTICLE_EFFECT:     { name: '粒子效果',     container: false, construct: MechanicParticleEffect,    premium: true },
    CANCEL_EFFECT:       { name: '效果取消',       container: false, construct: MechanicCancelEffect,      premium: true },
    PARTICLE_PROJECTILE: { name: '粒子抛射', container: true,  construct: MechanicParticleProjectile },
    PASSIVE:             { name: '被动',             container: true,  construct: MechanicPassive            },
    PERMISSION:          { name: '权限',          container: false, construct: MechanicPermission         },
    POTION:              { name: '药水',              container: false, construct: MechanicPotion             },
    POTION_PROJECTILE:   { name: '药水抛射',   container: true,  construct: MechanicPotionProjectile   },
    PROJECTILE:          { name: '普通抛射',          container: true,  construct: MechanicProjectile         },
    PURGE:               { name: '清除',               container: false, construct: MechanicPurge              },
    PUSH:                { name: '击退',                container: false, construct: MechanicPush               },
    REMEMBER_TARGETS:    { name: '记住目标',    container: false, construct: MechanicRememberTargets    },
    REPEAT:              { name: '重复',              container: true,  construct: MechanicRepeat             },
    SOUND:               { name: '声音',               container: false, construct: MechanicSound              },
    SPEED:               { name: '速度',               container: false, construct: MechanicSpeed              },
    STATUS:              { name: '状态',              container: false, construct: MechanicStatus             },
    TAUNT:               { name: '嘲讽',               container: false, construct: MechanicTaunt              },
    TRIGGER:             { name: '状态检测',             container: true,  construct: MechanicTrigger,           premium: true },
    VALUE_ADD:           { name: '添加存储值',           container: false, construct: MechanicValueAdd           },
    VALUE_ATTRIBUTE:     { name: '属性存储值',     container: false, construct: MechanicValueAttribute     },
    VALUE_COPY:          { name: '存储值复制',          container: false, construct: MechanicValueCopy,         premium: true },
    VALUE_DISTANCE:      { name: '距离存储值',      container: false, construct: MechanicValueDistance,     premium: true },
    VALUE_HEALTH:        { name: '血量存储值',        container: false, construct: MechanicValueHealth,       premium: true },
    VALUE_LOCATION:      { name: '位置存储值',      container: false, construct: MechanicValueLocation      },
    VALUE_LORE:          { name: 'Lore存储值',          container: false, construct: MechanicValueLore          },
    VALUE_LORE_SLOT:     { name: '槽存储值',     container: false, construct: MechanicValueLoreSlot,     premium: true},
    VALUE_MANA:          { name: '法力值存储值',          container: false, construct: MechanicValueMana,         premium: true },
    VALUE_MULTIPLY:      { name: '存储值翻倍',      container: false, construct: MechanicValueMultiply      },
    VALUE_PLACEHOLDER:   { name: '变量存储值',   container: false, construct: MechanicValuePlaceholder,  premium: true },
    VALUE_RANDOM:        { name: '随机存储值',        container: false, construct: MechanicValueRandom        },
    VALUE_SET:           { name: '普通存储值',           container: false, construct: MechanicValueSet           },
    WARP:                { name: '传送',                container: false, construct: MechanicWarp               },
    WARP_LOC:            { name: '坐标传送',       container: false, construct: MechanicWarpLoc            },
    WARP_RANDOM:         { name: '随机传送',         container: false, construct: MechanicWarpRandom         },
    WARP_SWAP:           { name: '相互传送',           container: false, construct: MechanicWarpSwap           },
    WARP_TARGET:         { name: '单向传送',         container: false, construct: MechanicWarpTarget         },
    WARP_VALUE:          { name: '存储值传送',          container: false, construct: MechanicWarpValue          },
    WOLF:                { name: '狼',                container: true,  construct: MechanicWolf               }
};

var saveIndex;

/**
 * Represents a component of a dynamic skill
 *
 * @param {string}    name      - name of the component
 * @param {string}    type      - type of the component
 * @param {boolean}   container - whether or not the component can contain others
 * @param {Component} [parent]  - parent of the component if any
 *
 * @constructor
 */
function Component(name, type, container, parent)
{
    this.name = name;
    this.type = type;
    this.container = container;
    this.parent = parent;
    this.html = undefined;
    this.components = [];
    this.data = [new StringValue('数值变量', 'icon-key', '').setTooltip('在技能图标Lore中添加上"{attr:"该行的内容"."注释里中括号内的英文"},显示为被注释目标的值.例如：先请移步至“范围”，在该栏填上“example”,则{attr:example.radius}=半径数值')];
    if (this.type == Type.MECHANIC) {
        this.data.push(new ListValue('释放类型', 'counts', [ 'True', 'False' ], 'True')
            .setTooltip('True为技能释放成功时的效果,会消耗法力并开始冷却,False为技能释放失败时的效果,该项可用于技能释放失败的惩罚')
        );
    }
    else if (this.type == Type.TRIGGER && name != 'Cast' && name != 'Initialize' && name != 'Cleanup')
    {
        this.data.push(new ListValue('需要法力值', 'mana', [ 'True', 'False' ], 'False')
            .setTooltip('触发该条件是否需要消耗法力值 False为不需要')
        );
        this.data.push(new ListValue('冷却时间归零激活', 'cooldown', [ 'True', 'False' ], 'False')
            .setTooltip('触发该条件是否需要等冷却时间归零')
        );
    }

    this.dataKey = 'data';
    this.componentKey = 'children';
}

Component.prototype.dupe = function(parent)
{
    var i;
    var ele = new Component(this.name, this.type, this.container, parent);
    for (i = 0; i < this.components.length; i++)
    {
        ele.components.push(this.components[i].dupe(ele));
    }
    ele.data = ele.data.slice(0, 1);
    for (i = ele.data.length; i < this.data.length; i++)
    {
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
Component.prototype.createBuilderHTML = function(target)
{
    // Create the wrapping divs with the appropriate classes
    var container = document.createElement('div');
    container.comp = this;
    if (this.type == Type.TRIGGER) {
        container.className = 'componentWrapper';
    }

    var div = document.createElement('div');
    div.className = 'component ' + this.type;
    if (this.type != Type.TRIGGER) {
        div.draggable = true;
        div.ondragstart = this.drag;
    }
    div.ondrop = this.drop;
    if (this.container) {
        div.ondragover = this.allowDrop;
    }

    // Component label
    var label = document.createElement('h3');
    label.title = '编辑 ' + this.name + ' 信息';
    label.className = this.type + 'Label';
    label.innerHTML = this.name;
    label.component = this;
    label.addEventListener('click', function(e) {
        this.component.createFormHTML();
        showSkillPage('skillForm');
    });
    div.appendChild(label);

    // Container components can add children so they get a button
    if (this.container)
    {
        var add = document.createElement('div');
        add.className = 'builderButton';
        add.innerHTML = '+ 添加内容';
        add.component = this;
        add.addEventListener('click', function(e) {
            activeComponent = this.component;
            showSkillPage('componentChooser');
        });
        div.appendChild(add);

        var vision = document.createElement('div');
        vision.title = '隐藏内容';
        vision.className = 'builderButton smallButton';
        vision.style.background = 'url("editor/img/eye.png") no-repeat center #222';
        vision.component = this;
        vision.addEventListener('click', function(e) {
            var comp = this.component;
            if (comp.childrenHidden)
            {
                comp.childDiv.style.display = 'block';
                this.style.backgroundImage = 'url("editor/img/eye.png")';
            }
            else
            {
                comp.childDiv.style.display = 'none';
                this.style.backgroundImage = 'url("editor/img/eyeShaded.png")';
            }
            comp.childrenHidden = !comp.childrenHidden;
        });
        div.appendChild(vision);
        this.childrenHidden = false;
    }

    // Add the duplicate button
    if (this.type != Type.TRIGGER)
    {
        var duplicate = document.createElement('div');
        duplicate.className = 'builderButton smallButton';
        duplicate.title = '复制';
        duplicate.style.background = 'url("editor/img/duplicate.png") no-repeat center #222';
        duplicate.component = this;
        duplicate.addEventListener('click', function(e) {
            var comp = this.component;
            var copy = comp.dupe(comp.parent);
            comp.parent.components.push(copy);
            copy.createBuilderHTML(comp.parent.html);
        });
        div.appendChild(duplicate);
    }

    // Add the remove button
    var remove = document.createElement('div');
    remove.title = '删除';
    remove.className = 'builderButton smallButton cancelButton';
    remove.style.background = 'url("editor/img/delete.png") no-repeat center #f00';
    remove.component = this;
    remove.addEventListener('click', function(e) {
        var list = this.component.parent.components;
        for (var i = 0; i < list.length; i++)
        {
            if (list[i] == this.component)
            {
                list.splice(i, 1);
                break;
            }
        }
        this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);
    });
    div.appendChild(remove);

    container.appendChild(div);

    // Apply child components
    var childContainer = document.createElement('div');
    childContainer.className = 'componentChildren';
    if (this.components.length > 0) {
        for (var i = 0; i < this.components.length; i++)
        {
            this.components[i].createBuilderHTML(childContainer);
        }
    }
    container.appendChild(childContainer);
    this.childDiv = childContainer;

    // Append the content
    target.appendChild(container);

    this.html = childContainer;
};

Component.prototype.allowDrop = function(e) {
    e.preventDefault();
    if (hoverSpace) {
        hoverSpace.style.marginBottom = '0px';
        hoverSpace.onmouseout = undefined;
    }
    hoverSpace = e.target;
    while (hoverSpace.className.indexOf('component') < 0) {
        hoverSpace = hoverSpace.parentNode;
    }
    var thing = document.getElementById('dragComponent');
    if (hoverSpace.id != 'dragComponent' && hoverSpace.parentNode.comp.container && canDrop(thing, hoverSpace)) {
        hoverSpace.style.marginBottom = '30px';
        hoverSpace.onmouseout = function() {
            if (!hoverSpace) {
                this.onmouseout = undefined;
                return;
            }
            hoverSpace.style.marginBottom = '0px';
            hoverSpace.onmouseout = undefined;
            hoverSpace = undefined;
        }
    }
    else hoverSpace = undefined;
};

Component.prototype.drag = function(e) {
    e.dataTransfer.setData('text', 'anything');
    var dragged = document.getElementById('dragComponent');
    if (dragged) {
        dragged.id = '';
    }
    e.target.id = 'dragComponent';
};

Component.prototype.drop = function(e) {
    if (hoverSpace) {
        hoverSpace.style.marginBottom = '0px';
        hoverSpace = undefined;
    }

    e.preventDefault();
    var thing = document.getElementById('dragComponent').parentNode;
    var target = e.target;
    while (target.className.indexOf('component') < 0) {
        target = target.parentNode;
    }
    if (target.id == 'dragComponent' || !target.parentNode.comp.container || !canDrop(thing, target)) {
        return;
    }
    var targetComp = target.parentNode.comp;
    var thingComp = thing.comp;
    target = target.parentNode.childNodes[1];
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
Component.prototype.createFormHTML = function()
{
    var target = document.getElementById('skillForm');

    var form = document.createElement('form');

    var header = document.createElement('h4');
    header.innerHTML = this.name;
    form.appendChild(header);

    if (this.description)
    {
        var desc = document.createElement('p');
        desc.innerHTML = this.description;
        form.appendChild(desc);
    }

    if (this.data.length > 1)
    {
        var h = document.createElement('hr');
        form.appendChild(h);

        var i = 1;
        for (var j = 1; j < this.data.length; j++) {
            if (this.data[j] instanceof AttributeValue) {
                i = 0;
                break;
            }
        }
        for (; i < this.data.length; i++)
        {
            this.data[i].hidden = false;
            this.data[i].createHTML(form);
        }
    }

    var hr = document.createElement('hr');
    form.appendChild(hr);

    var done = document.createElement('h5');
    done.className = 'doneButton';
    done.innerHTML = '确定';
    done.component = this;
    done.addEventListener('click', function(e) {
        this.component.update();
        document.getElementById('skillForm').removeChild(this.component.form);
        showSkillPage('builder');
    });
    form.appendChild(done);

    this.form = form;

    target.innerHTML = '';
    target.appendChild(form);
    activeComponent = this;

    for (var i = 0; i < this.data.length; i++)
    {
        this.data[i].applyRequireValues();
    }
}

/**
 * Updates the component using the form data if it exists
 */
Component.prototype.update = function()
{
    for (var j = 0; j < this.data.length; j++)
    {
        this.data[j].update();
    }
};

/**
 * Gets the save string for the component
 *
 * @param {string} spacing - spacing to put before the data
 */
Component.prototype.getSaveString = function(spacing)
{
    this.createFormHTML();

    var id = '';
    var index = saveIndex;
    while (index > 0 || id.length == 0)
    {
        id += String.fromCharCode((index % 26) + 97);
        index = Math.floor(index / 26);
    }
    var result = spacing + this.name + '-' + id + ":\n";
    saveIndex++;

    result += spacing + "  type: '" + this.type + "'\n";
    if (this.data.length > 0)
    {
        result += spacing + '  data:\n';
        for (var i = 0; i < this.data.length; i++)
        {
            if (!this.data[i].hidden)
                result += this.data[i].getSaveString(spacing + '    ');
        }
    }
    if (this.components.length > 0)
    {
        result += spacing + '  children:\n';
        for (var j = 0; j < this.components.length; j++)
        {
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

    for (var i = 0; i < data.options.length; i++) {
        var option = data.options[i];
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
                this.data.push(new MultiListValue(option.display, option.key, option.options, [ ])
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
    this.super('Block Break', Type.TRIGGER, true);
    this.description = '当玩家破坏指定信息的方块时触发';

    this.data.push(new MultiListValue('方块类型', 'material', getAnyMaterials, [ 'Any' ])
        .setTooltip('The type of block expected to be broken')
    );
    this.data.push(new IntValue('数量', 'data', -1)
        .setTooltip('需要破坏的方块数量(-1为破坏多少都可以)')
    );
}

extend('TriggerBlockPlace', 'Component');
function TriggerBlockPlace() {
    this.super('Block Place', Type.TRIGGER, true);
    this.description = '当玩家放置指定信息的方块时触发';

    this.data.push(new MultiListValue('方块类型', 'material', getAnyMaterials, [ 'Any' ])
        .setTooltip('The type of block expected to be placed')
    );
    this.data.push(new IntValue('数量', 'data', -1)
        .setTooltip('需要放置的方块数量(-1为放置多少都可以)')
    );
}

extend('TriggerCast', 'Component');
function TriggerCast()
{
    this.super('Cast', Type.TRIGGER, true);

    this.description = '使用技能栏/组合键/指令来触发技能';
}

extend('TriggerCleanup', 'Component');
function TriggerCleanup()
{
    this.super('Cleanup', Type.TRIGGER, true);

    this.description = '当玩家遗忘或删除技能时触发,通常用于限定技';
}

extend('TriggerCrouch', 'Component');
function TriggerCrouch()
{
    this.super('Crouch', Type.TRIGGER, true);

    this.description = '当玩家按下或松开下蹲键(shift)触发技能';

    this.data.push(new ListValue('类型', 'type', [ 'Start Crouching', 'Stop Crouching', 'Both' ], 'Start Crouching')
        .setTooltip('分别为 按下/松开/两者')
    );
}

extend('TriggerDeath', 'Component');
function TriggerDeath()
{
    this.super('Death', Type.TRIGGER, true);

    this.description = '玩家死亡时触发技能';
}

extend('TriggerEnvironmentDamage', 'Component');
function TriggerEnvironmentDamage()
{
    this.super('Environment Damage', Type.TRIGGER, true);

    this.description = '当玩家受到指定种类的环境伤害时触发技能';

    this.data.push(new ListValue('种类', 'type', DAMAGE_TYPES, 'FALL')
        .setTooltip('伤害的种类')
    );
}


extend('TriggerInitialize', 'Component');
function TriggerInitialize()
{
    this.super('Initialize', Type.TRIGGER, true);

    this.description = '玩家复活时触发技能,可以用来做被动技能';
}

extend('TriggerKill', 'Component');
function TriggerKill()
{
    this.super('Kill', Type.TRIGGER, true);

    this.description = '击杀实体时触发技能';
}

extend('TriggerLand', 'Component');
function TriggerLand()
{
    this.super('Land', Type.TRIGGER, true);

    this.description = '玩家落地时触发技能';

    this.data.push(new DoubleValue('最小距离', 'min-distance', 0)
        .setTooltip('距离地面的最小距离')
    );
}

extend('TriggerLaunch', 'Component');
function TriggerLaunch()
{
    this.super('Launch', Type.TRIGGER, true);

    this.description = '玩家射击/投掷指定物品时触发技能';

    this.data.push(new ListValue('类型', 'type', [ 'Any', 'Arrow', 'Egg', 'Ender Pearl', 'Fireball', 'Fishing Hook', 'Snowball' ], 'Any')
        .setTooltip('分别为 任何东西 弓箭 蛋 暗影珍珠 火球 鱼钩 雪球')
    );
}

extend('TriggerMove', 'Component');
function TriggerMove()
{
    this.super('Move', Type.TRIGGER, true);

    this.description = '玩家移动时发动.这会占用大量资源,尽量少用.使用 "api-moved" 去查看/调用移动距离';
}

extend('TriggerPhysicalDamage', 'Component');
function TriggerPhysicalDamage()
{
    this.super('Physical Damage', Type.TRIGGER, true);

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

extend('TriggerSkillDamage', 'Component');
function TriggerSkillDamage()
{
    this.super('Skill Damage', Type.TRIGGER, true);

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
function TriggerTookPhysicalDamage()
{
    this.super('Took Physical Damage', Type.TRIGGER, true);

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
function TriggerTookSkillDamage()
{
    this.super('Took Skill Damage', Type.TRIGGER, true);

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
function TargetArea()
{
    this.super('Area', Type.TARGET, true);

    this.description = '将目标指向指定半径内的所有实体';

    this.data.push(new AttributeValue("半径", "radius", 3, 0)
        .setTooltip('范围的半径,单位为方块')
    );
    this.data.push(new ListValue("群组", "group", ["Ally", "Enemy", "Both"], "Enemy")
        .setTooltip('攻击范围内的实体群组 分别为：盟友 敌人 两者')
    );
    this.data.push(new ListValue("穿墙", "wall", ['True', 'False'], 'False')
        .setTooltip('是否允许技能穿过墙壁寻找目标 False为不允许')
    );
    this.data.push(new ListValue("包括施法者", "caster", [ 'True', 'False' ], 'False')
        .setTooltip('目标是否包括施法者 False为不包括')
    );
    this.data.push(new AttributeValue("最大目标", "max", 99, 0)
        .setTooltip('目标数量的最大值,超出部分无效,如果目标包括施法者,施法者也计入')
    );
    this.data.push(new ListValue("随机", "random", [ 'True', 'False' ], 'False')
        .setTooltip('是否随机选取目标 False为不随机')
    );
}

extend('TargetCone', 'Component');
function TargetCone()
{
    this.super('Cone', Type.TARGET, true);

    this.description = '将目标指向施法者前面的一行中的所有实体(圆锥形).';

    this.data.push(new AttributeValue("距离", "range", 5, 0)
        .setTooltip('最大距离,单位为方块')
    );
    this.data.push(new AttributeValue("角度", "angle", 90, 0)
        .setTooltip('圆锥弧线角度')
    );
    this.data.push(new ListValue("群组", "group", ["Ally", "Enemy", "Both"], "Enemy")
        .setTooltip('攻击范围内的实体群组 分别为：盟友 敌人 两者')
    );
    this.data.push(new ListValue("穿墙", "wall", ['True', 'False'], 'False')
        .setTooltip('是否允许技能穿过墙壁寻找目标 False为不允许')
    );
    this.data.push(new ListValue("包括施法者", "caster", [ 'True', 'False' ], 'False')
        .setTooltip('目标是否包括施法者 False为不包括')
    );
    this.data.push(new AttributeValue("最大目标", "max", 99, 0)
        .setTooltip('目标数量的最大值,超出部分无效,如果目标包括施法者,施法者也计入')
    );
}

extend('TargetLinear', 'Component');
function TargetLinear()
{
    this.super('Linear', Type.TARGET, true);

    this.description = '将目标指向施法者前面的一行中的所有实体(直线)';

    this.data.push(new AttributeValue("距离", "range", 5, 0)
        .setTooltip('最大距离,单位为方块')
    );
    this.data.push(new AttributeValue("宽度", "tolerance", 4, 0)
        .setTooltip('直线的宽度,单位为方块,越宽越容易被指向')
    );
    this.data.push(new ListValue("群组", "group", ["Ally", "Enemy", "Both"], "Enemy")
        .setTooltip('攻击范围内的实体群组 分别为：盟友 敌人 两者')
    );
    this.data.push(new ListValue("穿墙", "wall", ['True', 'False'], 'False')
        .setTooltip('是否允许技能穿过墙壁寻找目标 False为不允许')
    );
    this.data.push(new ListValue("包括施法者", "caster", [ 'True', 'False' ], 'False')
        .setTooltip('目标是否包括施法者 False为不包括')
    );
    this.data.push(new AttributeValue("最大目标", "max", 99, 0)
        .setTooltip('目标数量的最大值,超出部分无效,如果目标包括施法者,施法者也计入')
    );
}

extend('TargetLocation', 'Component');
function TargetLocation()
{
    this.super('Location', Type.TARGET, true);

    this.description = '目标指向玩家十字准星所在位置. 将另一种目标选取与此结合以实现远程区域效果(与"范围"结合类似火男的W)';

    this.data.push(new AttributeValue('距离', 'range', 5, 0)
        .setTooltip('最大距离,单位为方块')
    );
    this.data.push(new ListValue('地面单位', 'ground', [ 'True', 'False' ], 'True')
        .setTooltip('准星坐标是否只能只在地面上(True 坐标必须在地上,False 坐标可以在空中)')
    );
}

extend('TargetNearest', 'Component');
function TargetNearest()
{
    this.super('Nearest', Type.TARGET, true);

    this.description = '以施法者为中心，指向最近的实体';

    this.data.push(new AttributeValue("半径", "radius", 3, 0)
        .setTooltip('范围的半径,单位为方块')
    );
    this.data.push(new ListValue("群组", "group", ["Ally", "Enemy", "Both"], "Enemy")
        .setTooltip('攻击范围内的实体群组 分别为：盟友 敌人 两者')
    );
    this.data.push(new ListValue("穿墙", "wall", ['True', 'False'], 'False')
        .setTooltip('是否允许技能穿过墙壁寻找目标 False为不允许')
    );
    this.data.push(new ListValue("包括施法者", "caster", [ 'True', 'False' ], 'False')
        .setTooltip('目标是否包括施法者 False为不包括')
    );
    this.data.push(new AttributeValue("最大目标", "max", 1, 0)
        .setTooltip('目标数量的最大值,超出部分无效,如果目标包括施法者,施法者也计入')
    );
}

extend('TargetOffset', 'Component');
function TargetOffset()
{
    this.super('Offset', Type.TARGET, true);

    this.description = '对目标选取的范围进行指定的偏移(需要之前就有一个"目标选取")并重新指向偏移后的范围';

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
function TargetRemember()
{
    this.super('Remember', Type.TARGET, true);

    this.description = '指向被记忆目标,使用"Remember Targets"(标记目标)效果来记忆目标,没有记忆目标则释放失败';

    this.data.push(new StringValue('记忆名称', 'key', 'target')
        .setTooltip('记忆的名称,不可重复')
    );
}

extend('TargetSelf', 'Component');
function TargetSelf()
{
    this.super('Self', Type.TARGET, true);

    this.description = '指向自己';
}

extend('TargetSingle', 'Component');
function TargetSingle()
{
    this.super('Single', Type.TARGET, true);

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

extend('ConditionArmor', 'Component');
function ConditionArmor()
{
    this.super('Armor', Type.CONDITION, true);
    this.description = "Applies child components when the target is wearing an armor item matching the given details.";

    this.data.push(new ListValue('护甲槽', 'armor', [ 'Helmet', 'Chestplate', 'Leggings', 'Boots', 'Any' ], 'Any')
        .setTooltip('指定的槽位,分别为头盔 胸甲 护腿 靴子 任意')
    );

    addItemOptions(this);
}

extend('ConditionAttribute', 'Component');
function ConditionAttribute()
{
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
function ConditionBiome()
{
    this.super('Biome', Type.CONDITION, true);

    this.description = '目标需要在(或不在)指定的生物群系';

    this.data.push(new ListValue('类型', 'type', [ 'In Biome', 'Not In Biome' ], 'In Biome')
        .setTooltip('分别为:在指定生物群系中 不在指定生物群系中')
    );
    this.data.push(new MultiListValue('生物群系', 'biome', getBiomes, [ 'Forest' ])
            .setTooltip('指定的生物群系')
    );
}

extend('ConditionBlock', 'Component');
function ConditionBlock()
{
    this.super('Block', Type.CONDITION, true);

    this.description = '目标需要以指定方式接触指定方块';

    this.data.push(new ListValue('方式', 'standing', [ 'On Block', 'Not On Block', 'In Block', 'Not In Block' ], 'On Block')
        .setTooltip('分别为 在方块上 不在方块上 在方块里 不在方块里 在/不在方块上检测的是脚下的方块 在/不在方块里检测的是脚所在位置的方块')
    );
    this.data.push(new ListValue('类型', 'material', getMaterials, 'Dirt')
        .setTooltip('方块的类型')
    );
}

extend('ConditionCeiling', 'Component');
function ConditionCeiling()
{
    this.super('Ceiling', Type.CONDITION, true);

    this.description = '目标需要与头上空间保持指定距离';

    this.data.push(new AttributeValue('距离', 'distance', 5, 0)
        .setTooltip('保持的距离,单位为方块')
    );
    this.data.push(new ListValue('高于或低于', 'at-least', [ 'True', 'False' ], 'True')
        .setTooltip('True表示必须高于指定距离 False表示必须低于指定距离')
    );
}

extend('ConditionChance', 'Component');
function ConditionChance()
{
    this.super('Chance', Type.CONDITION, true);

    this.description = '有几率释放技能';

    this.data.push(new AttributeValue('几率', 'chance', 25, 0)
        .setTooltip('技能释放的几率 "25" 表示几率为25%')
    );
}

extend('ConditionClass', 'Component');
function ConditionClass()
{
    this.super('Class', Type.CONDITION, true);

    this.description = '目标需要为指定职业';

    this.data.push(new StringValue('职业', 'class', 'Fighter')
        .setTooltip('所需要的职业')
    );
    this.data.push(new ListValue('精确', 'exact', [ 'True', 'False' ], 'False')
        .setTooltip('是否需要精确的职业,False为不需要,代表曾经为该职业也算,True代表当前必须是该职业')
    );
}

extend('ConditionClassLevel', 'Component');
function ConditionClassLevel()
{
    this.super('Class Level', Type.CONDITION, true);

    this.description = '施法者职业等级需要在指定范围内';

    this.data.push(new IntValue('最小等级', 'min-level', 2)
        .setTooltip('职业等级需要高于最小等级,如果有多个职业,则取决于主职业')
    );
    this.data.push(new IntValue('最大等级', 'max-level', 99)
        .setTooltip('职业等级需要低于于最大等级,如果有多个职业,则取决于主职业')
    );
}

extend('ConditionCombat', 'Component');
function ConditionCombat()
{
    this.super('Combat', Type.CONDITION, true);

    this.description = '目标需要在指定战斗状态保持指定时间';

    this.data.push(new ListValue('战斗状态', 'combat', [ 'True', 'False' ], 'True')
        .setTooltip('True表示在战斗状态,False表示脱离战斗状态')
    );
    this.data.push(new DoubleValue('时间', 'seconds', 10)
        .setTooltip('距离上个战斗状态的时间')
    );
}

extend('ConditionCrouch', 'Component');
function ConditionCrouch()
{
    this.super('Crouch', Type.CONDITION, true);

    this.description = '目标需要在(或不在)下蹲状态';

    this.data.push(new ListValue('在下蹲', 'crouch', [ 'True', 'False' ], 'True')
        .setTooltip('True表示需要目标在下蹲状态,False表示需要目标不在下蹲状态')
    );
}

extend('ConditionDirection', 'Component');
function ConditionDirection()
{
    this.super('Direction', Type.CONDITION, true);

    this.description = '当施法者或目标需要朝向(或不朝)对方';

    this.data.push(new ListValue('类型', 'type', [ 'Target', 'Caster' ], 'Target')
        .setTooltip('选择施法者或目标,Target为目标,Caster为施法者')
    );
    this.data.push(new ListValue('方向', 'direction', [ 'Away', 'Towards' ], 'Away')
        .setTooltip('施法者或目标需要的朝向,Away为不朝向,Towards为朝向')
    );
}

extend('ConditionElevation', 'Component');
function ConditionElevation()
{
    this.super('Elevation', Type.CONDITION, true);

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
function ConditionElse()
{
    this.super('Else', Type.CONDITION, true);

    this.description = '如果上一个触发条件没满足,则检查下一个触发条件,需要在这个的下面再填写一个触发条件,如果上一个条件满足,则跳过下面的触发条件.这不仅适用于条件未满足,还用于由于没有目标或其他情况而导致的技能释放失败';
}

extend('ConditionEntityType', 'Component');
function ConditionEntityType()
{
    this.super('Entity Type', Type.CONDITION, true);

    this.description = '需要目标与指定的实体类型相同'

    this.data.push(new MultiListValue('类型', 'types', getEntities)
        .setTooltip('指定的实体类型')
    );
}

extend('ConditionFire', 'Component');
function ConditionFire()
{
    this.super('Fire', Type.CONDITION, true);

    this.description = '需要目标在(或不在)燃烧';

    this.data.push(new ListValue('类型', 'type', [ 'On Fire', 'Not On Fire' ], 'On Fire')
        .setTooltip('分别为 在燃烧 不在燃烧 ')
    );
}

extend('ConditionFlag', 'Component');
function ConditionFlag()
{
    this.super('Flag', Type.CONDITION, true);

    this.description = '需要目标被(或不被)标记(与"选取目标"中的"记忆"区别在于,"记忆"是永久的,而"标记"可以设置持续时间,并且二者用于不同的位置)';

    this.data.push(new ListValue('类型', 'type', [ 'Set', 'Not Set' ], 'Set')
        .setTooltip('分别为 被标记 不被标记')
    );
    this.data.push(new StringValue('标记名称', 'key', 'key')
        .setTooltip('标记的名称')
    );
}

extend('ConditionGround', 'Component');
function ConditionGround()
{
    this.super('Ground', Type.CONDITION, true);

    this.description = '需要目标在(或不在)地面上';

    this.data.push(new ListValue('类型', 'type', [ 'On Ground', 'Not On Ground' ], 'On Ground')
        .setTooltip('分别为 在地面 不在地面')
    );
}

extend('ConditionHealth', 'Component');
function ConditionHealth()
{
    this.super('Health', Type.CONDITION, true);

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
function ConditionItem()
{
    this.super('Item', Type.CONDITION, true);
    this.description = "Applies child components when the target is wielding an item matching the given material.";

    addItemOptions(this);
}

extend('ConditionInventory', 'Component');
function ConditionInventory()
{
    this.super('Inventory', Type.CONDITION, true);

    this.description = '目标背包的指定区域需要有指定物品(对怪物无效)';

    this.data.push(new AttributeValue('数量', 'amount', 1, 0)
        .setTooltip('物品所需要的数量')
    );

    addItemOptions(this);
}

extend('ConditionLight', 'Component');
function ConditionLight()
{
    this.super('Light', Type.CONDITION, true);

    this.description = "需要目标位置的亮度到达指定数值";

    this.data.push(new AttributeValue('最小亮度', 'min-light', 0, 0)
        .setTooltip('目标位置的亮度需要大于最小亮度,16表示最亮,0表示最暗')
    );
    this.data.push(new AttributeValue('最大亮度', 'max-light', 16, 16)
        .setTooltip('目标位置的亮度需要小于最大亮度,16表示最亮,0表示最暗')
    );
}

extend('ConditionMana', 'Component');
function ConditionMana()
{
    this.super('Mana', Type.CONDITION, true);

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

extend('ConditionName', 'Component');
function ConditionName()
{
    this.super('Name', Type.CONDITION, true);

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
function ConditionOffhand()
{
    this.super('Offhand', Type.CONDITION, true);
    this.description = "Applies child components when the target is wielding an item matching the given material as an offhand item. This is for v1.9+ servers only.";

    addItemOptions(this);
}

extend('ConditionPermission', 'Component');
function ConditionPermission()
{
    this.super('Permission', Type.CONDITION, true);

    this.description = '需要施法者拥有指定权限';

    this.data.push(new StringValue('权限名', 'perm', 'some.permission')
        .setTooltip('施法者所需要拥有的权限名称')
    );
}

extend('ConditionPotion', 'Component');
function ConditionPotion()
{
    this.super('Potion', Type.CONDITION, true);

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
function ConditionSkillLevel(skill)
{
    this.super('Skill Level', Type.CONDITION, true);

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
function ConditionSlot()
{
    this.super('Slot', Type.CONDITION, true);
    this.description = "Applies child components when the target player has a matching item in the given slot.";

    this.data.push(new StringListValue('槽位(一行一个)', 'slot', [9])
        .setTooltip('位的位置 0-8代表快捷栏 9-35代表物品栏 36-39是护甲栏 40是副手,如果有多个,则需要全部满足')
    );

    addItemOptions(this);
}

extend('ConditionStatus', 'Component');
function ConditionStatus()
{
    this.super('Status', Type.CONDITION, true);

    this.description = '目标需要在(或不在)指定状态';

    this.data.push(new ListValue('类型', 'type', [ 'Active', 'Not Active' ], 'Active')
        .setTooltip('分别为在 不在')
    );
    this.data.push(new ListValue('状态', 'status', [ 'Any', 'Absorb', 'Curse', 'Disarm', 'Invincible', 'Root', 'Silence', 'Stun' ], 'Any')
        .setTooltip('目标需要的状态,分别为 任意 吸收 诅咒 缴械 无敌 禁锢 沉默 眩晕')
    );
}

extend('ConditionTime', 'Component');
function ConditionTime()
{
    this.super('Time', Type.CONDITION, true);

    this.description = '需要当前世界到达指定时间';

    this.data.push(new ListValue('时间', 'time', [ 'Day', 'Night' ], 'Day')
        .setTooltip('分别为 白天 黑夜')
    );
}

extend('ConditionTool', 'Component');
function ConditionTool()
{
    this.super('Tool', Type.CONDITION, true);

    this.description = '需要目标挥舞指定工具';

    this.data.push(new ListValue('材质', 'material', [ 'Any', 'Wood', 'Stone', 'Iron', 'Gold', 'Diamond' ], 'Any')
        .setTooltip('工具的材质,分别为 任意 木头 石头 铁 金 钻石')
    );
    this.data.push(new ListValue('工具', 'tool', [ 'Any', 'Axe', 'Hoe', 'Pickaxe', 'Shovel', 'Sword' ], 'Any')
        .setTooltip('工具的类型，分别为 任意 斧子 锄头 稿子 铲子 剑')
    );
}

extend('ConditionValue', 'Component');
function ConditionValue()
{
    this.super('Value', Type.CONDITION, true);

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
function ConditionWater()
{
    this.super('Water', Type.CONDITION, true);

    this.description = '目标需要在(或不在)水中';

    this.data.push(new ListValue('类型', 'state', [ 'In Water', 'Out Of Water' ], 'In Water')
        .setTooltip('分别为 在水中 不在水中')
    );
}

extend('ConditionWeather', 'Component');
function ConditionWeather()
{
    this.super('Weather', Type.CONDITION, true);

    this.description = '目标所在位置需要有指定的天气';

    this.data.push(new ListValue('天气类型', 'type', [ 'None', 'Rain', 'Snow', 'Thunder' ], 'Rain')
        .setTooltip('分别为 晴朗 雨天 雪天 雷雨天')
    );
}

// -- Mechanic constructors ---------------------------------------------------- //

extend('MechanicAttribute', 'Component');
function MechanicAttribute()
{
    this.super('Attribute', Type.MECHANIC, false);

    this.description = '给与目标玩家指定时间的属性加成';

    this.data.push(new StringValue('属性', 'key', 'Intelligence')
        .setTooltip('需要加成的属性名称')
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

extend('MechanicBlock', 'Component');
function MechanicBlock()
{
    this.super('Block', Type.MECHANIC, false);

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
    this.data.push(new AttributeValue('向前偏移', 'forward', 0, 0)
        .setTooltip('在目标向前偏移的位置生成方块，负数则向后偏移')
    );
    this.data.push(new AttributeValue('向上偏移', 'upward', 0, 0)
        .setTooltip('在目标向上偏移的位置生成方块，负数则向下偏移')
    );
    this.data.push(new AttributeValue('向右偏移', 'right', 0, 0)
        .setTooltip('在目标向右偏移的位置生成方块，负数则向左偏移')
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
}

extend('MechanicBuff', 'Component');
function MechanicBuff()
{
    this.super('Buff', Type.MECHANIC, false);

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
function MechanicCancel()
{
    this.super('Cancel', Type.MECHANIC, false);

    this.description = '取消由于该技能被触发的伤害.例如,如果该技能的触发需要"进行一次射击"则技能效果为该选项会取消射击所造成的伤害,应该与其他技能效果配合';
}

extend('MechanicCancelEffect', 'Component');
function MechanicCancelEffect()
{
    this.super('Cancel Effect', Type.MECHANIC, false);

    this.description = '提前取消粒子效果';

    this.data.push(new StringValue('效果名称', 'effect-key', 'default')
        .setTooltip('效果被设置时所使用的名称')
    );
}

extend('MechanicChannel', 'Component');
function MechanicChannel()
{
    this.super('Channel', Type.MECHANIC, true);

    this.description = '在吟唱过后应用子效果(可以中断).期间玩家不能移动(移动则取消),攻击或释放其他技能';

    this.data.push(new ListValue('固定', 'still', [ 'True', 'False' ], 'True')
        .setTooltip('玩家吟唱时是否被强制固定 True为是')
    );
    this.data.push(new AttributeValue('时间', 'time', 3, 0)
        .setTooltip('玩家所需吟唱的时间,单位为秒')
    );
}

extend('MechanicCleanse', 'Component');
function MechanicCleanse()
{
    this.super('Cleanse', Type.MECHANIC, false);

    this.description = '清除目标的负面药水效果或状态';

    this.data.push(new ListValue('药水效果', 'potion', getBadPotions, 'All')
        .setTooltip('分别为 所有效果 不清除药水效果 失明 反胃 饥饿 浮空 中毒 缓慢 挖掘疲劳 不幸 虚弱 凋零')
    );
    this.data.push(new ListValue('状态', 'status', [ 'All', 'None', 'Curse', 'Disarm', 'Root', 'Silence', 'Stun' ], 'All')
        .setTooltip('分别为 所有状态 不清除负面状态 诅咒 缴械 禁锢 沉默 眩晕')
    );
}

extend('MechanicCommand', 'Component');
function MechanicCommand()
{
    this.super('Command', Type.MECHANIC, false);

    this.description ='以OP或控制台作为身份对每个目标执行指定指令';

    this.data.push(new StringValue('指令', 'command', '')
        .setTooltip('需要执行的指令,使用{player}来代替玩家名称')
    );
    this.data.push(new ListValue('执行身份', 'type', [ 'Console', 'OP' ], 'OP')
        .setTooltip('以何种身份执行指令 Console将执行控制台的命令，而OP将在给予临时OP权限的同时让目标玩家执行它')
    );
}

extend('MechanicCooldown', 'Component');
function MechanicCooldown()
{
    this.super('Cooldown', Type.MECHANIC, false);

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
function MechanicDamage()
{
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
}

extend('MechanicDamageBuff', 'Component');
function MechanicDamageBuff()
{
    this.super('Damage Buff', Type.MECHANIC, false);

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
function MechanicDamageLore()
{
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
}

extend('MechanicDefenseBuff', 'Component');
function MechanicDefenseBuff()
{
    this.super('Defense Buff', Type.MECHANIC, false);

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
function MechanicDelay()
{
    this.super('Delay', Type.MECHANIC, true);

    this.description = '在指定延迟后应用子内容';

    this.data.push(new AttributeValue('延迟时间', 'delay', 2, 0)
        .setTooltip('延迟的时间,单位为秒')
    );
}

extend('MechanicDisguise', 'Component');
function MechanicDisguise()
{
    this.super('Disguise', Type.MECHANIC, false);

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
        .requireValue('type', [ 'Misc' ])
        .setTooltip('杂项的数据值,需要被LibsDisguise插件支持')
    );
}

extend('MechanicDurability', 'Component');
function MechanicDurability()
{
    this.super('Durability', Type.MECHANIC, false);

    this.description = '降低目标所持物品的耐久度';

    this.data.push(new AttributeValue('数值', 'amount', 1, 0)
        .setTooltip('需要降低耐久的数值')
    );
    this.data.push(new ListValue('副手', 'offhand', [ 'True', 'False' ], 'False')
        .setTooltip('是否同时应用于副手,False为否')
    );
}

extend('MechanicExplosion', 'Component');
function MechanicExplosion()
{
    this.super('Explosion', Type.MECHANIC, false);

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
function MechanicFire()
{
    this.super('Fire', Type.MECHANIC, false);

    this.description = '引燃目标指定时间';

    this.data.push(new AttributeValue('Seconds', 'seconds', 3, 1)
        .setTooltip('所引燃的时间,单位为秒')
    );
}

extend('MechanicFlag', 'Component');
function MechanicFlag()
{
    this.super('Flag', Type.MECHANIC, false);

    this.description = '标记目标一段时间,标记可以被"触发条件"和一些其他的东西所检测';

    this.data.push(new StringValue('标记名称', 'key', 'key')
        .setTooltip('不可重复,若需"触发条件"检测,则应设置为相同')
    );
    this.data.push(new AttributeValue('时间', 'seconds', 3, 1)
        .setTooltip('标记的持续时间,若想设置为永久,可在下面的"标记切换"中应用')
    );
}

extend('MechanicFlagClear', 'Component');
function MechanicFlagClear()
{
    this.super('Flag Clear', Type.MECHANIC, false);

    this.description = '清除目标的标记';

    this.data.push(new StringValue('标记名称', 'key', 'key')
        .setTooltip('不可重复,需要与被清除的标记的名称相同')
    );
}

extend('MechanicFlagToggle', 'Component');
function MechanicFlagToggle()
{
    this.super('Flag Toggle', Type.MECHANIC, false);

    this.description = '切换目标标记的有无("有"标记的话持续时间应该是永久的)';

    this.data.push(new StringValue('标记名称', 'key', 'key')
        .setTooltip('不可重复,需要与被切换的标记的名称相同')
    );
}

extend('MechanicFood', 'Component');
function MechanicFood()
{
    this.super('Food', Type.MECHANIC, false);

    this.description = '增加或减少目标的饱食度';

    this.data.push(new AttributeValue('数值', 'food', 1, 1)
        .setTooltip('需要增加的数值,负数为减少饱食度')
    );
    this.data.push(new AttributeValue('饱和度', 'saturation', 0, 0)
        .setTooltip('需要增加的数值,负数为减少饱和度,饱和度是隐藏的,影响饱食度下降的时间')
    );
}

extend('MechanicForgetTargets', 'Component');
function MechanicForgetTargets()
{
    this.super('Forget Targets', Type.MECHANIC, false);

    this.description = '清除目标从"记住目标（很后面有）"那的存储';

    this.data.push(new StringValue('关键词', 'key', 'key')
        .setTooltip('存储目标的唯一关键词，与"标记名称"类似')
    );
}

extend('MechanicHeal', 'Component');
function MechanicHeal()
{
    this.super('Heal', Type.MECHANIC, false);

    this.description = '回复每个目标的指定血量';

    this.data.push(new ListValue("类型", "type", [ "Health", "Percent" ], "Health")
        .setTooltip('治疗的类型,分别为 普通治疗 百分比治疗 百分比是按目标的最大血量进行治疗')
    );
    this.data.push(new AttributeValue("数值", "value", 3, 1)
        .setTooltip('回复血量的数值')
    );
}

extend('MechanicHealthSet', 'Component');
function MechanicHealthSet()
{
    this.super('Health Set', Type.MECHANIC, false);

    this.description = '将目标血量设置为指定数值,无视其他任何效果';

    this.data.push(new AttributeValue("生命值", "health", 1, 0)
        .setTooltip('需要设置的血量')
    );
}

extend('MechanicHeldItem', 'Component');
function MechanicHeldItem()
{
    this.super('Held Item', Type.MECHANIC, false);

    this.description = '将目标手持的物品移动到其指定槽位中,如果槽位是技能快捷键将会无效';

    this.data.push(new AttributeValue("槽位", "slot", 0, 0)
        .setTooltip('所移动到的槽位')
    );
}

extend('MechanicImmunity', 'Component');
function MechanicImmunity()
{
    this.super('Immunity', Type.MECHANIC, false);

    this.description = '使目标在指定时间内免疫指定的伤害'

    this.data.push(new ListValue('类型', 'type', DAMAGE_TYPES, 'Poison')
        .setTooltip('所需要免疫伤害的类型')
    );
    this.data.push(new AttributeValue('时间', 'seconds', 3, 0)
        .setTooltip('免疫所持续的时间')
    );
    this.data.push(new AttributeValue('百分比', 'multiplier', 0, 0)
        .setTooltip('免疫伤害的百分比,设成0则完全免疫')
    );
}

extend('MechanicInterrupt', 'Component');
function MechanicInterrupt()
{
    this.super('Interrupt', Type.MECHANIC, false);

    this.description = '中断每个目标的吟唱(如果适用)';
}

extend('MechanicItem', 'Component');
function MechanicItem()
{
    this.super('Item', Type.MECHANIC, false);

    this.description = '给予目标指定的物品';

    this.data.push(new ListValue('物品', 'material', getMaterials, 'Arrow')
        .setTooltip('给予物品的类型')
    );
    this.data.push(new IntValue('数量', 'amount', 1)
        .setTooltip('给予物品的数量')
    );
    this.data.push(new IntValue('耐久', 'data', 0)
        .setTooltip('给予物品的耐久度')
    );
    this.data.push(new IntValue('数据', 'byte', 0)
        .setTooltip('物品的数据值,如羊毛的颜色')
    );
    this.data.push(new ListValue('高级设置', 'custom', [ 'True', 'False' ], 'False')
        .setTooltip('给予的物品是否需要有名字和lore')
    );

    this.data.push(new StringValue('名字', 'name', 'Name').requireValue('custom', [ 'True' ])
        .setTooltip('给予物品的名字')
    );
    this.data.push(new StringListValue('Lore', 'lore', []).requireValue('custom', [ 'True' ])
        .setTooltip('给予物品的Lore)')
    );
}

extend('MechanicItemProjectile', 'Component');
function MechanicItemProjectile()
{
    this.super('Item Projectile', Type.MECHANIC, true);

    this.description = '发射一个抛射物，在着陆时应用子内容,该子内容的目标指向经过的生物或着陆的坐标';


    this.data.push(new ListValue('物品', 'item', getMaterials, 'Jack O Lantern')
        .setTooltip('抛射物的类型')
    ),
    this.data.push(new IntValue('物品数据', 'item-data', 0)
        .setTooltip('物品的数据值,如羊毛的颜色')
    ),

    addProjectileOptions(this);
    addEffectOptions(this, true);
}

extend('MechanicItemRemove', 'Component');
function MechanicItemRemove()
{
    this.super('Item Remove', Type.MECHANIC, false);

    this.description = '移除目标玩家背包内的指定物品,对怪物无效';

    this.data.push(new AttributeValue('数量', 'amount', 1, 0)
        .setTooltip('移除物品的数量')
    );

    addItemOptions(this);
}

extend('MechanicLaunch', 'Component');
function MechanicLaunch()
{
    this.super('Launch', Type.MECHANIC, false);

    this.description = '使目标向一个方向位移一段距离,如果值是负数,则向反方向冲刺';

    this.data.push(new ListValue('[付费版专享] 方向', 'relative', [ 'Target', 'Caster', 'Between'], 'Target')
        .setTooltip('冲刺的方向,"Target"为目标面朝的方向"Caster"为施法者面朝的方向"Between"为施法者到目标的方向')
    );
    this.data.push(new AttributeValue('向前速度', 'forward', 1, 0)
        .setTooltip('给与目标面朝方向的速度')
    );
    this.data.push(new AttributeValue('向上速度', 'upward', 0, 0)
        .setTooltip('给与目标向上的速度')
    );
    this.data.push(new AttributeValue('向右速度', 'right', 0, 0)
        .setTooltip('给与目标向右的速度')
    );
}

extend('MechanicLightning', 'Component');
function MechanicLightning()
{
    this.super('Lightning', Type.MECHANIC, false);

    this.description = '向目标或目标附近释放闪电,负值则向反方向释放';

    this.data.push(new ListValue('造成伤害', 'damage', ['True', 'False'], 'True')
        .setTooltip('闪电是否造成伤害,True为是')
    );
    this.data.push(new AttributeValue('向前偏移', 'forward', 0, 0)
        .setTooltip('在目标前方释放闪电')
    );
    this.data.push(new AttributeValue('向右偏移', 'right', 0, 0)
        .setTooltip('在目标右方释放闪电')
    );
}

extend('MechanicMana', 'Component');
function MechanicMana()
{
    this.super('Mana', Type.MECHANIC, false);

    this.description = '扣除或回复目标法力值';

    this.data.push(new ListValue('类型', 'type', [ 'Mana', 'Percent' ], 'Mana')
        .setTooltip('分别为 数值 百分比(按法力值上限)')
    );
    this.data.push(new AttributeValue('数值', 'value', 1, 0)
        .setTooltip('扣除或回复的数值,百分比类型下自带百分号')
    );
}

extend('MechanicMessage', 'Component');
function MechanicMessage()
{
    this.super('Message', Type.MECHANIC, false);

    this.description = '对每个目标玩家发送指定信息,如果要引用value插件的数值,请使用 {value储存的值}';

    this.data.push(new StringValue('信息', 'message', 'text')
        .setTooltip('所发送的信息内容')
    );
}

extend('MechanicParticle', 'Component');
function MechanicParticle()
{
    this.super('Particle', Type.MECHANIC, false);

    this.description = '在目标处播放粒子效果';

    addParticleOptions(this);

    this.data.push(new DoubleValue('向前偏移', 'forward', 0)
        .setTooltip('在目标前方指定距离播放粒子效果,负数为后方')
    );
    this.data.push(new DoubleValue('向上偏移', 'upward', 0)
        .setTooltip('在目标上方指定距离播放粒子效果,负数为下方')
    );
    this.data.push(new DoubleValue('向右偏移', 'right', 0)
        .setTooltip('在目标右方指定距离播放粒子效果,负数为左方')
    );
}

extend('MechanicParticleAnimation', 'Component');
function MechanicParticleAnimation()
{
    this.super('Particle Animation', Type.MECHANIC, false);

    this.description = '随着时间的推移在目标位置播放各种粒子动画';

    this.data.push(new IntValue('次数', 'steps', 1, 0)
        .setTooltip('播放并应用粒子的次数.')
    );
    this.data.push(new DoubleValue('频率', 'frequency', 0.05, 0)
        .setTooltip('应用动画的频率 0.05 是最快(1 tick),低于该值无效')
    );
    this.data.push(new IntValue('角度', 'angle', 0)
        .setTooltip('动画在持续时间内旋转的角度')
    );
    this.data.push(new IntValue('起始角度', 'start', 0)
        .setTooltip('动画的开始方向. 水平升降和偏移将基于此')
    );
    this.data.push(new AttributeValue('时间', 'duration', 5, 0)
        .setTooltip('动画播放的时间')
    );
    this.data.push(new AttributeValue('水平收缩', 'h-translation', 0, 0)
        .setTooltip('动画在一个周期内相对于中心水平移动的距离 正值使其从中心扩展 而负值使其向中间合拢')
    );
    this.data.push(new AttributeValue('垂直升降', 'v-translation', 0, 0)
        .setTooltip('动画在一个周期内垂直移动的距离 正值使其上升 而负值使其下降')
    );
    this.data.push(new IntValue('水平收缩次数', 'h-cycles', 1)
        .setTooltip('在整个动画中水平移动动画位置的次数 每隔一个循环将其移回到起始位置 例如,两个周期会将其扩展，然后重新合拢.')
    );
    this.data.push(new IntValue('垂直升降次数', 'v-cycles', 1)
        .setTooltip('在整个动画中垂直移动动画位置的次数 每隔一个循环将其移回到起始位置 例如,两个周期会将其上升，然后下降')
    );

    addParticleOptions(this);

    this.data.push(new DoubleValue('向前偏移', 'forward', 0)
        .setTooltip('在目标前方指定距离播放粒子动画,负数为后方')
    );
    this.data.push(new DoubleValue('向上偏移', 'upward', 0)
        .setTooltip('在目标上方指定距离播放粒子动画,负数为下方')
    );
    this.data.push(new DoubleValue('向右偏移', 'right', 0)
        .setTooltip('在目标右方指定距离播放粒子动画,负数为左方')
    );
}

extend('MechanicParticleEffect', 'Component');
function MechanicParticleEffect()
{
    this.super('Particle Effect', Type.MECHANIC, false);

    this.description = '跟随目标播放粒子效果,使用公式来确定形状，大小和运动';

    addEffectOptions(this, false);
}

extend('MechanicParticleProjectile', 'Component');
function MechanicParticleProjectile()
{
    this.super('Particle Projectile', Type.MECHANIC, true);

    this.description = '发射一个粒子抛射物，在着陆时应用子内容,该子内容的目标指向经过的生物或着陆的坐标';

    addProjectileOptions(this);

    this.data.push(new DoubleValue('重力', 'gravity', 0)
        .setTooltip('抛射所受到重力的影响程度,负数会使物品按照重力下降,正数则会使物品受到反重力上升,0为直线射击')
    );
    this.data.push(new ListValue('穿透', 'pierce', [ 'True', 'False' ], 'False')
        .setTooltip('是否穿透第一个目标并对以后的目标也造成效果,False为否')
    );

    addParticleOptions(this);

    this.data.push(new DoubleValue('频率', 'frequency', 0.05)
        .setTooltip('抛射物粒子播放的频率,除非播放的粒子太多,否则建议不要更改此值')
    );
    this.data.push(new DoubleValue('持续时间', 'lifespan', 3)
        .setTooltip('如果它没有击中任何东西,该抛射物会在多久后消失,时间太长会加重服务器负担')
    );

    addEffectOptions(this, true);
}

extend('MechanicPassive', 'Component');
function MechanicPassive()
{
    this.super('Passive', Type.MECHANIC, true);

    this.description = '不断应用子内容,下面的时间是应用间隔';

    this.data.push(new AttributeValue('Seconds', 'seconds', 1, 0)
        .setTooltip('每个子内容之间的间隔,单位为秒')
    );
}

extend('MechanicPermission', 'Component');
function MechanicPermission()
{
    this.super('Permission', Type.MECHANIC, true);

    this.description = '在指定时间内使目标玩家拥有指定权限.需要在Vault的基础上有相应的权限插件';

    this.data.push(new StringValue('权限', 'perm', 'plugin.perm.key')
        .setTooltip('权限的名称')
    );
    this.data.push(new AttributeValue('时间', 'seconds', 3, 0)
        .setTooltip('拥有权限的时间')
    );
}

extend('MechanicPotion', 'Component');
function MechanicPotion()
{
    this.super('Potion', Type.MECHANIC, false);

    this.description = '在指定时间对目标造成指定的药水效果';

    this.data.push(new ListValue('类型', 'potion', getPotionTypes, 'Absorption')
        .setTooltip('药水的类型')
    );
    this.data.push(new ListValue('粒子效果', 'ambient', [ 'True', 'False' ], 'True')
        .setTooltip('是否应用粒子效果.True为是')
    );
    this.data.push(new AttributeValue('等级', 'tier', 1, 0)
        .setTooltip('药水效果的等级')
    );
    this.data.push(new AttributeValue('时间', 'seconds', 3, 1)
        .setTooltip('药水效果持续的时间')
    );
}

extend('MechanicPotionProjectile', 'Component');
function MechanicPotionProjectile()
{
    this.super('Potion Projectile', Type.MECHANIC, true);

    this.description = '从每个目标上掉落一个没有任何效果的喷溅型药水.在落地时应用子内容,子内容的目标指向药水所命中的所有单位,如果没有命中任何单位,子内容的目标将指向落地点的坐标';

    this.data.push(new ListValue('视觉效果', 'type', getPotionTypes, 'Fire Resistance')
        .setTooltip('药水的视觉效果,不会造成真实效果')
    );
    this.data.push(new ListValue("群组", "group", ["Ally", "Enemy", "Both"], "Enemy")
        .setTooltip('子内容的目标群组,分别为：盟友 敌人 两者')
    );
    this.data.push(new ListValue('龙息', 'linger', [ 'True', 'False' ], 'False')
        .setTooltip('药水是否为龙息药水(适用于1.9及以上版本)')
    );
}

extend('MechanicProjectile', 'Component');
function MechanicProjectile()
{
    this.super('Projectile', Type.MECHANIC, true);

    this.description = '发射一个抛射物，在着陆时应用子内容,该子内容的目标指向经过的生物或着陆的坐标';

    this.data.push(new ListValue('类型', 'projectile', [ 'Arrow', 'Egg', 'Ghast Fireball', 'Snowball' ], 'Arrow')
        .setTooltip('抛射物的类型,分别为 箭矢 鸡蛋 火球 雪球')
    );
    this.data.push(new ListValue('燃烧', 'flaming', [ 'True', 'False' ], 'False')
        .setTooltip('抛射物是否燃烧,False为否')
    );
    this.data.push(new ListValue('消耗', 'cost', [ 'None', 'All', 'One' ], 'None')
        .setTooltip('发动技能时是否消耗目标身上的相应物品,None为不消耗,All为全消耗,One为消耗一个')
    );

    addProjectileOptions(this);
    addEffectOptions(this, true);
}

extend('MechanicPurge', 'Component');
function MechanicPurge()
{
    this.super('Purge', Type.MECHANIC, false);

    this.description = '清除目标的身上的正面的药水效果或状态';

    this.data.push(new ListValue('药水效果', 'potion', getGoodPotions, 'All')
        .setTooltip('需要清除的正面药水效果,All表示所有')
    );
    this.data.push(new ListValue('状态', 'status', [ 'None', 'All', 'Absorb', 'Invincible' ], 'All')
        .setTooltip('需要清除的正面状态,All表示所有')
    );
}

extend('MechanicPush', 'Component');
function MechanicPush()
{
    this.super('Push', Type.MECHANIC, false);

    this.description = '对目标造成基于施法者(可在"基于目标中更换")位置的击退,目标是施法者则无效';

  this.data.push(new ListValue('击退类型', 'type', [ 'Fixed', 'Inverse', 'Scaled' ], 'Fixed')
    .setTooltip('根据目标的位置造成不同的击退程度,Fixed对所有目标造成相同的击退程度,Inverse表示目标越远击退程度越大,Scaled表示目标越近击退程度越大')
  );
    this.data.push(new AttributeValue('速度', 'speed', 3, 1)
      .setTooltip('击退目标的速度,负值将会拉扯目标')
  );
    this.data.push(new StringValue('基于目标', 'source', 'none')
        .setTooltip('内容应填"记住目标"效果中被记住关键词,默认是施法者')
    );
}

extend('MechanicRememberTargets', 'Component');
function MechanicRememberTargets()
{
    this.super('Remember Targets', Type.MECHANIC, false);

    this.description = '以一个关键词的方式来记住目标';

    this.data.push(new StringValue('关键词', 'key', 'target')
        .setTooltip('不可重复,用这个关键词来表示被记住的目标')
    );
}

extend('MechanicRepeat', 'Component');
function MechanicRepeat()
{
    this.super('Repeat', Type.MECHANIC, true);

    this.description = '应用子内容指定次数';

    this.data.push(new AttributeValue('重复次数', 'repetitions', 3, 0)
        .setTooltip('子内容的重复次数')
    );
    this.data.push(new DoubleValue('间隔', 'period', 1)
        .setTooltip('每个子内容被应用之间的时间间隔')
    );
    this.data.push(new DoubleValue('延迟', 'delay', 0)
        .setTooltip('应用第一个子内容前的延迟时间')
    );
    this.data.push(new ListValue('失败停止', 'stop-on-fail', [ 'True', 'False' ], 'False')
        .setTooltip('如果效果失败,是否提前终止重复,False为否')
    );
}

extend('MechanicSound', 'Component');
function MechanicSound()
{
    this.super('Sound', Type.MECHANIC, false);

    this.description = "在目标位置播放指定声音";

    this.data.push(new ListValue('声音', 'sound', getSounds, 'Ambience Cave')
        .setTooltip('需要播放的声音')
    );
    this.data.push(new AttributeValue('音量', 'volume', 100, 0)
        .setTooltip('音量的百分比,100以上声音并不会变大,但是可以从更远的地方听到')
    );
    this.data.push(new AttributeValue('音调', 'pitch', 1, 0)
        .setTooltip('声音的音调,在0.5和2之间.')
    );
}

extend('MechanicSpeed', 'Component');
function MechanicSpeed()
{
    this.super('Speed', Type.MECHANIC, false);

    this.description = '将指定目标玩家的速度调整到一定倍数,于药水效果相堆叠';

    this.data.push(new AttributeValue('倍数', 'multiplier', 1.2, 0)
        .setTooltip('需要调整的倍数')
    );
    this.data.push(new AttributeValue('持续时间', 'duration', 3, 1)
        .setTooltip('速度调整的持续时间')
    );
}

extend('MechanicStatus', 'Component');
function MechanicStatus()
{
    this.super('Status', Type.MECHANIC, false);

    this.description = '对目标造成指定状态效果,持续指定时间';

    this.data.push(new ListValue('状态', 'status', [ 'Absorb', 'Curse', 'Disarm', 'Invincible', 'Root', 'Silence', 'Stun' ], 'Stun')
        .setTooltip('分别为 吸收 诅咒 缴械 无敌 禁锢 沉默 眩晕')
    );
    this.data.push(new AttributeValue('Duration', 'duration', 3, 1)
        .setTooltip('How long in seconds to apply the status')
    );
}

extend('MechanicTaunt', 'Component');
function MechanicTaunt()
{
    this.super('Taunt', Type.MECHANIC, false);

    this.description = '吸引目标生物的仇恨,使其攻击施法者.在Spigot或Bukkit端上,只有老版本有效，如果有MythicMobs,可以目标的仇恨值';

    this.data.push(new AttributeValue('仇恨值', 'amount', 1, 0)
        .setTooltip('目标增加的仇恨值,使用负数来消除仇恨,在服务端安装MythicMobs的情况下有效')
    );
}

extend('MechanicTrigger', 'Component');
function MechanicTrigger()
{
    this.super('Trigger', Type.MECHANIC, true);

    this.description = '在指定时间检测目标的状态';

    this.data.push(new ListValue('状态', 'trigger', [ 'Crouch', 'Death', 'Environment Damage', 'Kill', 'Land', 'Launch', 'Physical Damage', 'Skill Damage', 'Took Physical Damage', 'Took Skill Damage' ], 'Crouch')
        .setTooltip('需要检测的状态,分别为 下蹲 死亡 受到环境伤害 击杀 着陆 射击 物理伤害 技能伤害 受到物理伤害 受到技能伤害')
    );
    this.data.push(new AttributeValue('时间', 'duration', 5, 0)
        .setTooltip('检测目标的持续时间')
    );
    this.data.push(new ListValue('重复检测', 'stackable', [ 'True', 'False', ], 'True')
        .setTooltip('不同的玩家(或同一玩家)是否可以同时检测同一目标,True为是')
    );
    this.data.push(new ListValue('单次', 'once', [ 'True', 'False' ], 'True')
        .setTooltip('在指定的时间中,是否只检测一次,将其设置为false表示可以在指定的时间中检测多次')
    );

    // CROUCH
    this.data.push(new ListValue('类型', 'type', [ 'Start Crouching', 'Stop Crouching', 'Both' ], 'Start Crouching')
        .requireValue('trigger', [ 'Crouch' ])
        .setTooltip('检测下蹲的类型 分别为 开始下蹲 取消下蹲 两者都检测')
    );

    // ENVIRONMENT_DAMAGE
    this.data.push(new ListValue('类型', 'type', DAMAGE_TYPES, 'FALL')
        .requireValue('trigger', [ 'Environment Damage' ])
        .setTooltip('检测环境伤害的类型')
    );

    // LAND
    this.data.push(new DoubleValue('最小距离', 'min-distance', 0)
        .requireValue('trigger', [ 'Land' ])
        .setTooltip('检测着陆时的最小距离.')
    );

    // LAUNCH
    this.data.push(new ListValue('类型', 'type', [ 'Any', 'Arrow', 'Egg', 'Ender Pearl', 'Fireball', 'Fishing Hook', 'Snowball' ], 'Any')
        .requireValue('trigger', [ 'Launch' ])
        .setTooltip('检测射击的类型,分别为 任意 箭矢 鸡蛋 末影珍珠 火球 鱼钩 雪球')
    );

    // PHYSICAL
    this.data.push(new ListValue('类型', 'type', [ 'Both', 'Melee', 'Projectile' ], 'Both')
        .requireValue('trigger', [ 'Physical Damage', 'Took Physical Damage' ])
        .setTooltip('检测物理伤害的类型,分别为 两者 近战伤害 远程伤害')
    );

    // SKILL
    this.data.push(new StringValue('技能名称', 'category', '')
        .requireValue('trigger', [ 'Skill Damage', 'Took Skill Damage' ])
        .setTooltip('需要检测技能的名称,留空以检测所有技能')
    );

    // DAMAGE
    var damageTriggers = [ 'Physical Damage', 'Skill Damage', 'Took Physical Damage', 'Took Skill Damage' ];
    this.data.push(new ListValue('子目标检测', 'target', [ 'True', 'False' ], 'True')
        .requireValue('trigger', damageTriggers)
        .setTooltip('True使子目标为之前被检测的目标,False使子目标为与之战斗的实体')
    );
    this.data.push(new DoubleValue("最小伤害", "dmg-min", 0)
        .requireValue('trigger', damageTriggers)
        .setTooltip('需要检测的最小伤害')
    );
    this.data.push(new DoubleValue("最大伤害", "dmg-max", 999)
        .requireValue('trigger', damageTriggers)
        .setTooltip('需要检测的最大伤害')
    );
}

extend('MechanicValueAdd', 'Component');
function MechanicValueAdd()
{
    this.super('Value Add', Type.MECHANIC, false);
    
    this.description = '给施法者指定的关键词增加存储值,如果该关键词没有存储任何值,则将该值设置为给定量';
    
    this.data.push(new StringValue('关键词', 'key', 'value')
        .setTooltip('不可重复')
    );
    this.data.push(new AttributeValue('数值', 'amount', 1, 0)
        .setTooltip('需要增加的数值')
    );
}

extend('MechanicValueAttribute', 'Component');
function MechanicValueAttribute() 
{
    this.super('Value Attribute', Type.MECHANIC, false);
    
    this.description = '将目标指定属性的值计入指定关键词的存储值';
    
    this.data.push(new StringValue('关键词', 'key', 'attribute')
        .setTooltip('不可重复')
    );
    this.data.push(new StringValue('属性', 'attribute', 'Vitality')
        .setTooltip('需要计入关键词的存储值的属性')
    );
}

extend('MechanicValueCopy', 'Component');
function MechanicValueCopy()
{
    this.super('Value Copy', Type.MECHANIC, false);
    
    this.description = '将指定关键词的存储值从施法者复制到目标的另一个关键词,也可以反过来';
    
    this.data.push(new StringValue('关键词', 'key', 'value')
        .setTooltip('不可重复')
    );
    this.data.push(new StringValue('另一个关键词', 'destination', 'value')
        .setTooltip('所复制到的另一个关键词')
    );
    this.data.push(new ListValue('到目标', 'to-target', [ 'True', 'False' ], 'True')
        .setTooltip('True为从施法者到目标,False为从目标到施法者')
    );
}

extend('MechanicValueDistance', 'Component');
function MechanicValueDistance()
{
    this.super('Value Distance', Type.MECHANIC, false);

    this.description = '将目标与施法者的距离计入一个关键词的存储值';

    this.data.push(new StringValue('关键词', 'key', 'attribute')
        .setTooltip('不可重复')
    );
}

extend('MechanicValueHealth', 'Component');
function MechanicValueHealth()
{
    this.super('Value Health', Type.MECHANIC, false);
    
    this.description = '将目标指定关键词的存储值计入施法者相应关键词的存储值';
    
    this.data.push(new StringValue('关键词', 'key', 'value')
        .setTooltip('不可重复')
    );
    this.data.push(new ListValue('类型', 'type', [ 'Current', 'Max', 'Missing', 'Percent' ], 'Current')
        .setTooltip('Current表示目标的当前血量,max表示目标的最大血量,missing表示目标已损失的血量,percent表示目标当前血量与最大血量的百分比')
    );
}

extend('MechanicValueLocation', 'Component');
function MechanicValueLocation() 
{
    this.super('Value Location', Type.MECHANIC, false);
    
    this.description = '将第一个目标位置计入指定关键词的存储值';
    
    this.data.push(new StringValue('关键词', 'key', 'location')
        .setTooltip('不可重复')
    );
}

extend('MechanicValueLore', 'Component');
function MechanicValueLore()
{
    this.super('Value Lore', Type.MECHANIC, false);
    
    this.description = '将手持物品Lore计入施法者指定关键词的存储值';
    
    this.data.push(new StringValue('关键词', 'key', 'lore')
        .setTooltip('不可重复')
    );
    this.data.push(new ListValue("主副手", "hand", [ 'Main', 'Offhand' ], 'Main')
        .setTooltip('Main为主手')
    );
    this.data.push(new StringValue('正则表达式', 'regex', 'Damage: {value}')
        .setTooltip('需要正则表达式所检索的值,使用{value}表示需要存储的值')
    );
    this.data.push(new AttributeValue('倍数', 'multiplier', 1, 0)
        .setTooltip('改变检索到的值的倍数然后再进行存储,如果你不想改变,将其设置为1')
    );
}

extend('MechanicValueLoreSlot', 'Component');
function MechanicValueLoreSlot()
{
    this.super('Value Lore Slot', Type.MECHANIC, false);
    
    this.description = '将指定槽内物品的Lore计入施法者指定关键词的存储值';
    
    this.data.push(new StringValue('关键词', 'key', 'lore')
        .setTooltip('不可重复')
    );
    this.data.push(new IntValue("槽位", "slot", 9)
        .setTooltip('槽位的位置 0-8代表快捷栏 9-35代表物品栏 36-39是护甲栏 40是副手')
    );
    this.data.push(new StringValue('正则表达式', 'regex', 'Damage: {value}')
        .setTooltip('需要正则表达式所检索的值,使用{value}表示需要存储的值')
    );
    this.data.push(new AttributeValue('倍数', 'multiplier', 1, 0)
        .setTooltip('改变检索到的值的倍数然后再进行存储,如果你不想改变,将其设置为1')
    );
}

extend('MechanicValueMana', 'Component');
function MechanicValueMana()
{
    this.super('Value Mana', Type.MECHANIC, false);
    
    this.description = '将目标玩家的法力值计入施法者指定关键词的存储值';
    
    this.data.push(new StringValue('关键词', 'key', 'value')
        .setTooltip('不可重复')
    );
    this.data.push(new ListValue('类型', 'type', [ 'Current', 'Max', 'Missing', 'Percent' ], 'Current')
        .setTooltip('Current表示目标的当前法力值,max表示目标的最大法力值,missing表示目标已损失的法力值,percent表示目标当前法力值与最大法力值的百分比')
    );
}

extend('MechanicValueMultiply', 'Component');
function MechanicValueMultiply()
{
    this.super('Value Multiply', Type.MECHANIC, false);

    this.description = '将施法者指定关键词的存储值进行倍数变化';

    this.data.push(new StringValue('关键词', 'key', 'value')
        .setTooltip('不可重复')
    );
    this.data.push(new AttributeValue('倍数', 'multiplier', 1, 0)
        .setTooltip('需要变化的倍数,1代表不变')
    );
}

extend('MechanicValuePlaceholder', 'Component');
function MechanicValuePlaceholder()
{
    this.super('Value Placeholder', Type.MECHANIC, false);

    this.description = '将一个变量计入施法者指定关键词的存储值';

    this.data.push(new StringValue('关键词', 'key', 'value')
        .setTooltip('不可重复')
    );
    this.data.push(new ListValue("类型", "type", [ 'Number', 'String' ], 'Number')
        .setTooltip('存储值的类型,Number表示数值,String表示字符,可以用于信息或指令')
    );
    this.data.push(new StringValue('变量', 'placeholder', '%player_food_level%')
        .setTooltip('所计入的变量名 如果使用String类型，可以包含多个变量')
    );
}

extend('MechanicValueRandom', 'Component')
function MechanicValueRandom()
{
    this.super('Value Random', Type.MECHANIC, false);
    
    this.description = '将一个随机数计入施法者指定关键词的存储值';
    
    this.data.push(new StringValue('关键词', 'key', 'value')
        .setTooltip('The unique key to store the value under. This key can be used in place of attribute values to use the stored value.')
    );
    this.data.push(new ListValue('类型', 'type', [ 'Normal', 'Triangular' ], 'Normal')
        .setTooltip('Normal表示普通随机,Triangular更倾向于随机中间的数字,类似摇两个骰子')
    );
    this.data.push(new AttributeValue('最小', 'min', 0, 0)
        .setTooltip('随机的最小值')
    );
    this.data.push(new AttributeValue('最大', 'max', 0, 0)
        .setTooltip('随机的最大值')
    );
}

extend('MechanicValueSet', 'Component');
function MechanicValueSet()
{
    this.super('Value Set', Type.MECHANIC, false);
    
    this.description = '将指定数值计入施法者指定关键词的存储值';
    
    this.data.push(new StringValue('关键词', 'key', 'value')
        .setTooltip('不可重复')
    );
    this.data.push(new AttributeValue('数值', 'value', 1, 0)
        .setTooltip('需要计入关键词的数值')
    );
}

extend('MechanicWarp', 'Component');
function MechanicWarp()
{
    this.super('Warp', Type.MECHANIC, false);
    
    this.description = '在目标前进方向进行传送';
    
    this.data.push(new ListValue('穿墙', 'walls', [ 'True', 'False' ], 'False')
        .setTooltip('传送是否能穿墙,False为否')
    );
    this.data.push(new AttributeValue('向前', 'forward', 3, 1)
        .setTooltip('向前传送的距离,负数表示向后传送')
    );
    this.data.push(new AttributeValue('向上', 'upward', 0, 0)
        .setTooltip('向上传送的距离,负数表示向下传送')
    );
    this.data.push(new AttributeValue('向右', 'right', 0, 0)
        .setTooltip('向右传送的距离,负数表示向左传送')
    );
}

extend('MechanicWarpLoc', 'Component');
function MechanicWarpLoc()
{
    this.super('Warp Location', Type.MECHANIC, false);
    
    this.description = '将目标传送至指定世界的指定坐标';
    
    this.data.push(new StringValue('世界', 'world', 'current')
        .setTooltip('需要传送到的世界的名称,current表示当前世界')
    );
    this.data.push(new DoubleValue('X', 'x', 0)
        .setTooltip('坐标的X轴')
    );
    this.data.push(new DoubleValue('Y', 'y', 0)
        .setTooltip('坐标的Y轴')
    );
    this.data.push(new DoubleValue('Z', 'z', 0)
        .setTooltip('坐标的Z轴')
    );
    this.data.push(new DoubleValue('左右偏差', 'yaw', 0)
        .setTooltip('左右方向的偏差')
    );
    this.data.push(new DoubleValue('上下偏差', 'pitch', 0)
        .setTooltip('上下方向的偏差')
    );
}

extend('MechanicWarpRandom', 'Component');
function MechanicWarpRandom()
{
    this.super('Warp Random', Type.MECHANIC, false);
    
    this.description = '在给定距离的情况下将目标传送随机方向';
    
    this.data.push(new ListValue('水平传送', 'horizontal', [ 'True', 'False' ], 'True')
        .setTooltip('是否只允许水平传送,True为是')
    );
    this.data.push(new ListValue('穿墙', 'walls', [ 'True', 'False' ], 'False')
        .setTooltip('传送是否能穿墙,False为否')
    );
    this.data.push(new AttributeValue('距离', 'distance', 3, 1)
        .setTooltip('传送的最大距离')
    );
}

extend('MechanicWarpSwap', 'Component');
function MechanicWarpSwap()
{
    this.super('Warp Swap', Type.MECHANIC, false);
    
    this.description = '切换施法者和目标的位置 如果指向多个目标,则选取第一个目标';
}

extend('MechanicWarpTarget', 'Component');
function MechanicWarpTarget()
{
    this.super('Warp Target', Type.MECHANIC, false);
    
    this.description = '将施法者传送至目标位置,或将目标传送至施法者位置';
    
    this.data.push(new ListValue('类型', 'type', [ 'Caster to Target', 'Target to Caster' ], 'Caster to Target')
        .setTooltip('分别为 将施法者传送至目标位置 将目标传送至施法者位置')
    );
}

extend('MechanicWarpValue', 'Component');
function MechanicWarpValue() 
{
    this.super('Warp Value', Type.MECHANIC, false);
    
    this.description = '将所有目标传送至指定关键词的存储值所代表的坐标';
    
    this.data.push(new StringValue('存储值', 'key', 'location')
        .setTooltip('不可重复')
    );
}

extend('MechanicWolf', 'Component');
function MechanicWolf()
{
    this.super('Wolf', Type.MECHANIC, true);
    
    this.description = '在每个目标处召唤若干只狼,子内容的目标将指向狼,因此你可以给它们施加效果,你也可以给它自己的技能组,但不能视为主动释放.';
    
    this.data.push(new ListValue('项圈颜色', 'color', getDyes(), 'Black')
        .setTooltip('狼项圈的颜色')
    );
    this.data.push(new StringValue('名字', 'name', "{player}的狼")
        .setTooltip('狼显示的名字,使用{player}代替施法者的名字')
    );
    this.data.push(new AttributeValue('血量', 'health', 10, 0)
        .setTooltip('狼的起始血量')
    );
    this.data.push(new AttributeValue('伤害', 'damage', 3, 0)
        .setTooltip('狼每次攻击所造成的伤害')
    );
    this.data.push(new ListValue('坐着', 'sitting', [ 'True', 'False' ], 'False')
        .setTooltip('[付费版专享]狼被召唤出来时是否坐着')
    );
    this.data.push(new AttributeValue('时间', 'seconds', 10, 0)
        .setTooltip('狼的持续时间')
    );
    this.data.push(new AttributeValue('数量', 'amount', 1, 0)
        .setTooltip('狼的数量')
    );
    this.data.push(new StringListValue('技能(一行一个)', 'skills', [])
        .setTooltip('狼的技能 技能使为狼释放,因此主动释放的技能无效')
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
    
    component.data.push(new ListValue('物品形状', 'check-mat', [ 'True', 'False' ], 'True')
        .setTooltip('物品是否需要指定形状 True为需要')
    );
    component.data.push(new ListValue('形状', 'material', getMaterials, 'Arrow')
        .requireValue('check-mat', [ 'True' ])
        .setTooltip('物品的形状')
    );
    
    component.data.push(new ListValue('物品数据', 'check-data', [ 'True', 'False' ], 'False')
        .setTooltip('物品是否需要指定的数据值 False为不需要')
    );
    component.data.push(new IntValue('数据', 'data', 0)
        .requireValue('check-data', [ 'True' ])
        .setTooltip('物品的数据值')
    );
    
    component.data.push(new ListValue('物品Lore', 'check-lore', [ 'True', 'False' ], 'False')
        .setTooltip('物品是否需要指定的Lore False为不需要')
    );
    component.data.push(new StringValue('Lore', 'lore', 'text')
        .requireValue('check-lore', [ 'True' ])
        .setTooltip('物品的Lore')
    );
    
    component.data.push(new ListValue('显示名称', 'check-name', [ 'True', 'False' ], 'False')
        .setTooltip('是否需要指定的显示名称 False为不需要')
    );
    component.data.push(new StringValue('名称', 'name', 'name')
        .requireValue('check-name', [ 'True' ])
        .setTooltip('物品的名称')
    );
    
    component.data.push(new ListValue('正则表达式', 'regex', [ 'True', 'False' ], 'False')
        .setTooltip('物品的名字和lore是否需要被正则表达式所检索,False为不需要')
    );
}

function addProjectileOptions(component) {
    
    // General data
    component.data.push(new ListValue("群组", "group", ["Ally", "Enemy"], "Enemy")
        .setTooltip('目标的群组 分别为：盟友 敌人')
    );
    component.data.push(new ListValue('路线类型', 'spread', [ 'Cone', 'Horizontal Cone', 'Rain' ], 'Cone')
        .setTooltip('物品移动路线的类型物品移动的路线，分别为：抛物线 直线 下落 抛物线像箭一样 直线平行于地面 下落像雨一样')
    );
    component.data.push(new AttributeValue('数量', 'amount', 1, 0)
        .setTooltip('抛射物的数量')
    );
    component.data.push(new AttributeValue('速度', 'velocity', 3, 0)
        .setTooltip('抛射物发射的速度 负值则以相反方向发射')
    );
    
    // Cone values
    component.data.push(new AttributeValue('偏离', 'angle', 30, 0)
        .requireValue('spread', [ 'Cone', 'Horizontal Cone' ])
        .setTooltip('抛射物每枚偏离的角度（像弹道扩散），如果你只是射击一枚抛射物就不用管')
    );
    component.data.push(new DoubleValue('高度', 'position', 0, 0)
        .requireValue('spread', [ 'Cone', 'Horizontal Cone' ])
        .setTooltip('抛射物起始位置与地面的距离')
    );
    
    // Rain values
    component.data.push(new AttributeValue('高度', 'height', 8, 0)
        .requireValue('spread', [ 'Rain' ])
        .setTooltip('抛射物下落位置与地面的距离')
    );
    component.data.push(new AttributeValue('半径', 'rain-radius', 2, 0)
        .requireValue('spread', [ 'Rain' ])
        .setTooltip('下落的半径')
    );
    
    // Offsets
    component.data.push(new AttributeValue('向前偏移', 'forward', 0, 0)
        .setTooltip('抛射物会在目标前方多远时发射,负数为后方')
    );
    component.data.push(new AttributeValue('向上偏移', 'upward', 0, 0)
        .setTooltip('抛射物会在目标上方多远时发射,负数为下方')
    );
    component.data.push(new AttributeValue('向右偏移', 'right', 0, 0)
        .setTooltip('抛射物会在目标右方多远时发射,负数为左方')
    );
}

/**
 * Adds the options for particle effects to the components
 *
 * @param {Component} component - the component to add to
 */
function addParticleOptions(component) {
    component.data.push(new ListValue('粒子种类', 'particle', 
        [ 
            'Angry Villager', 
            'Barrier',
            'Block Crack', 
            'Bubble', 
            'Cloud', 
            'Crit', 
            'Damage Indicator',
            'Death', 
            'Death Suspend', 
            'Dragon Breath',
            'Drip Lava', 
            'Drip Water', 
            'Enchantment Table', 
            'End Rod',
            'Ender Signal', 
            'Explode', 
            'Firework Spark', 
            'Flame', 
            'Footstep', 
            'Happy Villager', 
            'Heart', 
            'Huge Explosion', 
            'Hurt', 
            'Icon Crack', 
            'Instant Spell', 
            'Large Explode', 
            'Large Smoke', 
            'Lava', 
            'Magic Crit', 
            'Mob Spell', 
            'Mob Spell Ambient', 
            'Mobspawner Flames', 
            'Note', 
            'Portal', 
            'Potion Break', 
            'Red Dust', 
            'Sheep Eat', 
            'Slime', 
            'Smoke', 
            'Snowball Poof', 
            'Snow Shovel', 
            'Spell', 
            'Splash', 
            'Sweep Attack',
            'Suspend', 
            'Town Aura', 
            'Water Drop',
            'Water Wake',
            'Witch Magic', 
            'Wolf Hearts', 
            'Wolf Shake', 
            'Wolf Smoke' 
        ], 'Angry Villager')
        .setTooltip('粒子播放的种类. 显示DX，DY和DZ选项的粒子效果与Cauldron服务端不兼容')
    );
    
    component.data.push(new ListValue('材质', 'material', getMaterials, 'Dirt').requireValue('particle', [ 'Block Crack', 'Icon Crack' ])
        .setTooltip('Block Crack 或 Icon Crack 所需要用到的材质')
    );
    component.data.push(new IntValue('数据值', 'type', 0).requireValue('particle', [ 'Block Crack', 'Icon Crack' ])
        .setTooltip('Block Crack 或 Icon Crack 所需要用到的材质的数据值')
    );
    
    component.data.push(new ListValue('布置方式', 'arrangement', [ 'Circle', 'Hemisphere', 'Sphere' ], 'Circle')
        .setTooltip('粒子的布置方式.Circle是一个2D圆,Hemisphere是一半的3D球体,Sphere是一个3D球体')
    );
    component.data.push(new AttributeValue('半径', 'radius', 4, 0)
        .setTooltip('粒子的半径')
    );
    component.data.push(new AttributeValue('粒子数量', 'particles', 20, 0)
        .setTooltip('播放的粒子的数量')
    );
    
    // Circle arrangement direction
    component.data.push(new ListValue('2D圆的方向', 'direction', [ 'XY', 'XZ', 'YZ' ], 'XZ').requireValue('arrangement', [ 'Circle' ])
        .setTooltip('XY 和 YZ 是垂直的圆 XZ是水平的圆')
    );
    
    // Bukkit particle data value
    component.data.push(new IntValue('数据值', 'data', 0).requireValue('particle', [ 'Smoke', 'Ender Signal', 'Mobspawner Flames', 'Potion Break' ])
        .setTooltip('粒子所用到的数据值,表示颗粒之间的效果发生的变化,例如烟雾颗粒的方向或药水破裂的颜色')
    );
    
    // Reflection particle data
    var reflectList = [ 'Angry Villager', 'Bubble', 'Cloud', 'Crit', 'Damage Indicator', 'Death Suspend', 'Dragon Breath', 'Drip Lava', 'Drip Water', 'Enchantment Table', 'End Rod', 'Explode', 'Fireworks Spark', 'Flame', 'Footstep', 'Happy Villager', 'Hear', 'Huge Explosion', 'Instant Spell', 'Large Explode', 'Large Smoke', 'Lava', 'Magic Crit', 'Mob Spell', 'Mob Spell Ambient', 'Note', 'Portal', 'Red Dust', 'Slime', 'Snowball Poof', 'Snow Shovel', 'Spell', 'Splash', 'Suspend', 'Sweep Attack', 'Town Aura', 'Water Drop', 'Water Wake', 'Witch Magic' ];
    component.data.push(new IntValue('可视半径', 'visible-radius', 25).requireValue('particle', reflectList)
        .setTooltip('玩家在多远能看到粒子效果')
    );
    component.data.push(new DoubleValue('DX', 'dx', 0).requireValue('particle', reflectList)
        .setTooltip('粒子移动的最大距离,用于距离粒子在X方向上移动的位置有多远')
    );
    component.data.push(new DoubleValue('DY', 'dy', 0).requireValue('particle', reflectList)
        .setTooltip('粒子移动的最大距离,用于距离粒子在Y方向上移动的位置有多远')
    );
    component.data.push(new DoubleValue('DZ', 'dz', 0).requireValue('particle', reflectList)
        .setTooltip('粒子移动的最大距离,用于距离粒子在Z方向上移动的位置有多远')
    );
    component.data.push(new DoubleValue('播放速度', 'speed', 1).requireValue('particle', reflectList)
        .setTooltip('控制粒子的颜色或速度')
    );
    component.data.push(new DoubleValue('波动数值', 'amount', 1).requireValue('particle', reflectList)
        .setTooltip('将此值设置为0可以控制某些粒子的颜色')
    );
}

function addEffectOptions(component, optional)
{
    var opt = appendNone;
    if (optional)
    {
        opt = appendOptional;
        
        component.data.push(new ListValue('使用粒子效果', 'use-effect', [ 'True', 'False' ], 'False')
            .setTooltip('[付费版专享]是否使用粒子效果 False为否')
        );
    }
    
    component.data.push(opt(new StringValue('效果名称', 'effect-key', 'default')
        .setTooltip('粒子效果的名称,每次只能动用一个粒子效果')
    ));
    component.data.push(opt(new AttributeValue('时间', 'duration', 1, 0)
        .setTooltip('粒子效果持续的时间')
    ));
    
    component.data.push(opt(new StringValue('形状', '-shape', 'hexagon')
        .setTooltip('粒子形状的名称,可在"effects.yml"中获取')
    ));
    component.data.push(opt(new ListValue('形状方向', '-shape-dir', [ 'XY', 'YZ', 'XZ' ], 'XY')
        .setTooltip('形状适用的平面,XZ是扁平的，另外两个是垂直的')
    ));
    component.data.push(opt(new StringValue('形状尺寸', '-shape-size', '1')
        .setTooltip('形状的尺寸.可以是使用wiki中定义的任何类型的公式')
    ));
    component.data.push(opt(new StringValue('动画', '-animation', 'one-circle')
        .setTooltip('粒子动画的名称.可在"effects.yml"中获取')
    ));
    component.data.push(opt(new ListValue('动画方向', '-anim-dir', [ 'XY', 'YZ', 'XZ' ], 'XZ')
        .setTooltip('动画的移动方向,XZ是扁平的，另外两个是垂直的')
    ));
    component.data.push(opt(new StringValue('动画尺寸', '-anim-size', '1')
        .setTooltip('动画的尺寸.可以是使用wiki中定义的任何类型的公式')
    ));
    component.data.push(opt(new IntValue('间隔', '-interval', 1)
        .setTooltip('粒子的播放间隔')
    ));
    component.data.push(opt(new IntValue('查看范围', '-view-range', 25)
        .setTooltip('粒子效果在多远能被看到')
    ));
    
    component.data.push(opt(new ListValue('粒子类型', '-particle-type', [
            'BARRIER',
            'BLOCK_CRACK',
            'CLOUD',
            'CRIT',
            'CRIT_MAGIC',
            'DAMAGE_INDICATOR',
            'DRAGON_BREATH',
            'DRIP_LAVA',
            'DRIP_WATER',
            'ENCHANTMENT_TABLE',
            'END_ROD',
            'EXPLOSION_HUGE',
            'EXPLOSION_LARGE',
            'EXPLOSION_NORMAL',
            'FIREWORKS_SPARK',
            'FLAME',
            'FOOTSTEP',
            'HEART',
            'LAVA',
            'MOB_APPEARANCE',
            'NOTE',
            'PORTAL',
            'REDSTONE',
            'SLIME',
            'SMOKE_NORMAL',
            'SMOKE_LARGE',
            'SNOWBALL',
            'SNOW_SHOVEL',
            'SPELL',
            'SPELL_INSTANT',
            'SPELL_MOB',
            'SPELL_MOB_AMBIENT',
            'SPELL_WITCH',
            'SUSPEND_DEPTH',
            'SUSPENDED',
            'SWEEP_ATTACK',
            'TOWN_AURA',
            'VILLAGER_ANGRY',
            'VILLAGER_HAPPY',
            'WATER_BUBBLE',
            'WATER_SPLASH',
            'WATER_WAKE'
        ], 'BARRIER')
        .setTooltip('粒子的类型')
    ));
    component.data.push(opt(new ListValue('粒子材质', '-particle-material', getMaterials, 'WOOD')
        .requireValue('-particle-type', [ 'BLOCK_CRACK' ])
        .setTooltip('粒子的材质')
    ));
    component.data.push(opt(new IntValue('粒子数据', '-particle-data', 0)
        .requireValue('-particle-type', [ 'BLOCK_CRACK' ])
        .setTooltip('粒子的数据值')
    ));
    component.data.push(opt(new IntValue('Particle Num', '-particle-amount', 0)
        .setTooltip('粒子的整数数据,通常标记为“数量”')
    ));
    component.data.push(opt(new DoubleValue('DX', '-particle-dx', 0)
        .setTooltip('粒子的DX值，通常用于颜色')
    ));
    component.data.push(opt(new DoubleValue('DY', '-particle-dy', 0)
        .setTooltip('粒子的DY值，通常用于颜色')
    ));
    component.data.push(opt(new DoubleValue('DZ', '-particle-dz', 0)
        .setTooltip('粒子的DZ值，通常用于颜色')
    ));
    component.data.push(opt(new DoubleValue('速度', '-particle-speed', 1)
        .setTooltip('粒子的速度')
    ));
}

function appendOptional(value)
{
    value.requireValue('use-effect', [ 'True' ]);
    return value;
}

function appendNone(value)
{
    return value;
}
