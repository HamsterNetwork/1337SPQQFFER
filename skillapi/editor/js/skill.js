/**
 * Represents the data for a dynamic skill
 *
 * @param {string} name - the name of the skill
 *
 * @constructor
 */
function Skill(name)
{
	this.components = [];

	// Included to simplify code when adding components
	this.html = document.getElementById('builderContent');
	
	this.dataKey = 'attributes';
	this.componentKey = 'components';
	
	// Skill data
	this.data = [
		new StringValue('技能名称', 'name', name).setTooltip('技能的名称，不能包含颜色代码'),
		new StringValue('技能类型', 'type', 'SomeType').setTooltip('描述技能是什么类型的技能，像是“群体法术伤害”，可以是任意值'),
		new IntValue('技能最高等级', 'max-level', 5).setTooltip('技能能够提升到的最高等级'),
		new ListValue('前置技能需求', 'skill-req', ['None'], 'None').setTooltip('在解锁这个技能前所需要解锁的前置技能'),
		new IntValue('前置技能等级需求', 'skill-req-lvl', 1).setTooltip('解锁这个技能所需要的前置技能的等级要求，如果上一项为None，那么这一项无效'),
		new ListValue('是否需要权限来解锁', 'needs-permission', ['True', 'False'], 'False').setTooltip('这个技能是否需要权限来解锁，权限的节点像是这样"skillapi.skill.{技能名称}"'),
		new AttributeValue('职业等级需求', 'level', 1, 0).setTooltip('解锁这个技能所需要的职业等级'),
		new AttributeValue('解锁技能所需技能点', 'cost', 1, 0).setTooltip('解锁这个技能所需要的技能点，可能升级技能也是参考这个数值，有待考证'),
		new AttributeValue('技能冷却时间', 'cooldown', 0, 0).setTooltip('技能的冷却时间，单位是秒 (只对Cast Trigger触发器有效)'),
		new AttributeValue('技能法力消耗', 'mana', 0, 0).setTooltip('使用这个技能所消耗的法力值(只对Cast Trigger触发器有效)'),
		new AttributeValue('最小技能点消耗', 'points-spent-req', 0, 0).setTooltip('在升级技能之前，所需要的最少技能点'),
		new StringValue('技能释放消息', 'msg', '&6{player} &2释放了 &6{skill}').setTooltip('当玩家释放这个技能的时候，在聊天框发出的消息，消息的半径请在config.yml中设置。'),
        new StringValue('连击按键', 'combo', '').setTooltip('通过连续按下按键来触发技能（必须要在配置文件中激活）。 使用 L, R, S, LS, RS, P, and Q 来确定按键/鼠标点击类型，使用空格分隔. 举个例子, "L L R R" 意味着左键两下，右键两下触发技能。'),
        new ListValue('指示器', 'indicator', [ '2D', '3D', 'None' ], '2D').setTooltip('[付费插件功能] 使用什么方案来显示图标。在casting bars设置中适用于"hover bar"设置。'),
		new ListValue('图标', 'icon', getMaterials, 'Jack O Lantern').setTooltip('在技能树中显示的图标。'),
		new IntValue('自定义模型数据', 'icon-data', 0).setTooltip('使用Custom Model Data或是耐久值的模型/材质来显示这个物品。'),
		new StringListValue('图标显示的Lore', 'icon-lore', [
			'&d{name} &7({level}/{max})',
			'&2技能类型: &6{type}',
			'',
			'{req:level}需求等级: {attr:level}',
			'{req:cost}消耗技能点: {attr:cost}',
			'',
			'&2法力消耗: {attr:mana}',
			'&2冷却时间: {attr:cooldown}'
		]).setTooltip('这个描述会在技能树中被展示，也就是鼠标悬停在技能图标上的时候会显示。这里面的占位符，像是伤害数值，会使用后面会提到机制中的，选择器中的或者条件中的"Icon Key"的数值来替换。'),
		new StringListValue('不兼容技能', 'incompatible', []).setTooltip('要解锁这个技能，不能有填写的这些前置技能。')
	];
}

/**
 * Applies the skill data to the HTML page, overwriting any previous data
 */ 
Skill.prototype.apply = function() 
{
	var builder = document.getElementById('builderContent');
	builder.innerHTML = '';
	
	// Set up the builder content
	for (var i = 0; i < this.components.length; i++)
	{
		this.components[i].createBuilderHTML(builder);
	}
}

/**
 * Creates the form HTML for editing the skill and applies it to
 * the appropriate area on the page
 */
Skill.prototype.createFormHTML = function()
{
	let i;
	var form = document.createElement('form');
	
	var header = document.createElement('h4');
	header.innerHTML = '技能属性';
	form.appendChild(header);
	
    form.appendChild(document.createElement('hr'));
    form.appendChild(this.createEditButton(form));
    form.appendChild(document.createElement('hr'));
	
	this.data[3].list.splice(1, this.data[3].list.length - 1);
	for (i = 0; i < skills.length; i++)
	{
		if (skills[i] != this) 
		{
			this.data[3].list.push(skills[i].data[0].value);
		}
	}

	for (i = 0; i < this.data.length; i++)
	{
		this.data[i].createHTML(form);
	}

	
	var hr = document.createElement('hr');
	form.appendChild(hr);
	
	form.appendChild(this.createEditButton(form));
	
	var target = document.getElementById('skillForm');
	target.innerHTML = '';
	target.appendChild(form);
}

Skill.prototype.createEditButton = function(form) {
    var done = document.createElement('h5');
	done.className = 'doneButton';
	done.innerHTML = '返回技能编辑主页',
	done.skill = this;
	done.form = form;
	done.addEventListener('click', function(e) {
		this.skill.update();
		var list = document.getElementById('skillList');
		list[list.selectedIndex].text = this.skill.data[0].value;
		this.form.parentNode.removeChild(this.form);
		showSkillPage('builder');
	});
    return done;
}

/**
 * Updates the skill data from the details form if it exists
 */
Skill.prototype.update = function()
{
	var index;
	var list = document.getElementById('skillList');
	for (var i = 0; i < skills.length; i++)
	{
		if (skills[i] == this)
		{
			index = i;
			break;
		}
	}
	var prevName = this.data[0].value;
	for (var j = 0; j < this.data.length; j++)
	{
		this.data[j].update();
	}
	var newName = this.data[0].value;
	this.data[0].value = prevName;
	if (isSkillNameTaken(newName)) return;
	this.data[0].value = newName;
	list[index].text = this.data[0].value;
}

/**
 * Checks whether or not the skill is using a given trigger
 *
 * @param {string} trigger - name of the trigger to check
 *
 * @returns {boolean} true if using it, false otherwise
 */ 
Skill.prototype.usingTrigger = function(trigger)
{
	for (var i = 0; i < this.components.length; i++)
	{
		if (this.components[i].name == trigger) return true;
	}
	return false;
}

/**
 * Creates and returns a save string for the skill
 */ 
Skill.prototype.getSaveString = function()
{
	var saveString = '';
	
	saveString += this.data[0].value + ":\n";
	for (var i = 0; i < this.data.length; i++)
	{
		if (isAttribute(this.data[i])) continue;
		saveString += this.data[i].getSaveString('  ');
	}
	saveString += '  attributes:\n';
	for (var i = 0; i < this.data.length; i++)
	{
		if (isAttribute(this.data[i]))
		{
			saveString += this.data[i].getSaveString('    ');
		}
	}
	if (this.components.length > 0)
	{
		saveString += '  components:\n';
		saveIndex = 0;
		for (var i = 0; i < this.components.length; i++)
		{
			saveString += this.components[i].getSaveString('    ');
		}
	}
	return saveString;
}

function isAttribute(input) {
    return (input instanceof AttributeValue) || (input.key == 'incompatible');
}

/**
 * Loads skill data from the config lines stating at the given index
 *
 * @param {YAMLObject} data - the data to load
 *
 * @returns {Number} the index of the last line of data for this skill
 */
Skill.prototype.load = function(data)
{
	if (data.active || data.embed || data.passive)
	{
		// Load old skill config for conversion
	}
	else 
	{
		this.loadBase(data);
	}
}

Skill.prototype.loadBase = loadSection;

/**
 * Creates a new skill and switches the view to it
 *
 * @returns {Skill} the new skill
 */ 
function newSkill()
{
	var id = 1;
	while (isSkillNameTaken('Skill ' + id)) id++;
	
	activeSkill = addSkill('Skill ' + id);
	
	var list = document.getElementById('skillList');
	list.selectedIndex = list.length - 2;
	
	activeSkill.apply();
	activeSkill.createFormHTML();
	showSkillPage('skillForm');
	
	return activeSkill;
}

/**
 * Adds a skill to the editor without switching the view to it
 *
 * @param {string} name - the name of the skill to add
 *
 * @returns {Skill} the added skill
 */ 
function addSkill(name) 
{
	var skill = new Skill(name);
	skills.push(skill);
	
	var option = document.createElement('option');
	option.text = name;
	var list = document.getElementById('skillList');
	list.add(option, list.length - 1);
	
	return skill;
}

/**
 * Checks whether or not a skill name is currently taken
 *
 * @param {string} name - name to check for
 *
 * @returns {boolean} true if the name is taken, false otherwise
 */ 
function isSkillNameTaken(name)
{
	return getSkill(name) != null;
}

/**
 * Retrieves a skill by name
 *
 * @param {string} name - name of the skill to retrieve
 *
 * @returns {Skill} the skill with the given name or null if not found
 */
function getSkill(name)
{
	name = name.toLowerCase();
	for (var i = 0; i < skills.length; i++)
	{
		if (skills[i].data[0].value.toLowerCase() == name) return skills[i];
	}
	return null;
}


var activeSkill = new Skill('Skill 1');
var activeComponent = undefined;
var skills = [activeSkill];
activeSkill.createFormHTML();
showSkillPage('skillForm');
