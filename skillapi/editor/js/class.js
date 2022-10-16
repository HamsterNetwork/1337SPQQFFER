/**
 * Represents the data for a dynamic class
 *
 * @param {string} name - name of the class
 *
 * @constructor
 */
var rep_attribs_text = {
	vitality : '活力',
    spirit : '精神',
    intelligence : '智力',
    dexterity : '灵巧',
    strength : '力量'
}
function Class(name)
{
	this.dataKey = 'attributes';
	this.componentKey = 'classes do not have components';
    this.attribCount = 0;

	// Class data
	this.data = [
		new StringValue('职业名称', 'name', name).setTooltip('职业名称，不要使用颜色代码'),
		new StringValue('前缀', 'prefix', '&6' + name).setTooltip('显示在玩家名称前的前缀，可以使用颜色代码'),
		new StringValue('职业组', 'group', 'class').setTooltip('例如XX帮 XX团 XX族，不要重复，直接填职业名称也可以'),
		new StringValue('法力名称', 'mana', '&2Mana').setTooltip('职业法力的名称，例如法力/能量/怒气'),
		new IntValue('最高等级', 'max-level', 40).setTooltip('职业所能升到的最高等级，转职后仍可以被引用'),
		new ListValue('父职业', 'parent', ['None'], 'None').setTooltip('先成为父职业才可以成为该职业 None为不需要 如需添加请将父职业加载至该编辑器'),
		new ListValue('权限', 'needs-permission', ['True', 'False'], 'False').setTooltip('需要特定权限才能解锁 False为不需要 权限格式：skillapi.class.{职业名称}'),
        new ByteListValue('经验来源', 'exp-source', [ '怪物', '方块破坏', '方块放置', '合成', '指令', '特殊', '经验瓶', '冶炼', '任务' ], 273).setTooltip('职业经验的来源，大部分只有当 config.yml文件中的"use-exp-orbs"启用后有效'),
		new AttributeValue('血量', 'health', 20, 0).setTooltip('职业的血量'),
		new AttributeValue('法力值', 'mana', 20, 0).setTooltip('职业的法力值'),
		new DoubleValue('法力恢复', 'mana-regen', 1, 0).setTooltip('每个间隔恢复的法力值. 间隔在config.yml中设置，默认为1秒.如果想设置小数请增加间隔'),
		new ListValue('技能树类型', 'tree', [ 'Basic Horizontal', 'Basic Vertical', 'Level Horizontal', 'Level Vertical', 'Flood', 'Requirement' ], 'Requirement').setTooltip('依次为基础横向 基础纵向 阶梯横向 阶梯纵向 平铺 自定义'),
		new StringListValue('技能 (一行一个)', 'skills', []).setTooltip('该职业可以使用的技能'),
		new ListValue('图标', 'icon', getMaterials, 'Jack O Lantern').setTooltip('在GUI中职业显示的图标'),
		new IntValue('图标数据', 'icon-data', 0).setTooltip('图标的数据值/耐久度'),
		new StringListValue('图标Lore', 'icon-lore', [
			'&d' + name
		]).setTooltip('在GUI中图标显示的Lore'),
		new StringListValue('不可用物品', 'blacklist', [ ]).setTooltip('该职业无法使用的物品(一行一个)'),
		new StringValue('Action Bar', 'action-bar', '').setTooltip('action bar中所使用的格式 不填为默认格式')
	];

    this.updateAttribs(10);
}

Class.prototype.updateAttribs = function(i)
{
    var j = 0;
    var back = {};
    while (this.data[i + j] instanceof AttributeValue)
    {
        back[this.data[i + j].key.toLowerCase()] = this.data[i + j];
        j++;
    }
    this.data.splice(i, this.attribCount);
    this.attribCount = 0;
    for (j = 0; j < ATTRIBS.length; j++)
    {
        var attrib = ATTRIBS[j].toLowerCase();
        var format = rep_attribs_text[attrib]
        this.data.splice(i + j, 0, new AttributeValue(format, attrib.toLowerCase(), 0, 0)
            .setTooltip('The amount of ' + format + ' the class should have')
        );
        if (back[attrib])
        {
            var old = back[attrib];
            this.data[i + j].base = old.base;
            this.data[i + j].scale = old.scale;
        }
        this.attribCount++;
    }
};

/**
 * Creates the form HTML for editing the class and applies it to
 * the appropriate area on the page
 */
Class.prototype.createFormHTML = function()
{
	var form = document.createElement('form');

	var header = document.createElement('h4');
	header.innerHTML = '职业详细';
	form.appendChild(header);

	var h = document.createElement('hr');
	form.appendChild(h);

	this.data[5].list.splice(1, this.data[5].list.length - 1);
	for (var i = 0; i < classes.length; i++)
	{
		if (classes[i] != this)
		{
			this.data[5].list.push(classes[i].data[0].value);
		}
	}
	for (var i = 0; i < this.data.length; i++)
	{
		this.data[i].createHTML(form);

        // Append attributes
        if (this.data[i].name == 'Mana')
        {
            var dragInstructions = document.createElement('label');
            dragInstructions.id = 'attribute-label';
            dragInstructions.innerHTML = 'Drag/Drop your attributes.yml file to see custom attributes';
            form.appendChild(dragInstructions);
            this.updateAttribs(i + 1);
        }
	}

	var hr = document.createElement('hr');
	form.appendChild(hr);

	var save = document.createElement('h5');
	save.innerHTML = '保存职业',
	save.classData = this;
	save.addEventListener('click', function(e) {
		this.classData.update();
		saveToFile(this.classData.data[0].value + '.yml', this.classData.getSaveString());
	});
	form.appendChild(save);

	var del = document.createElement('h5');
	del.innerHTML = '删除',
	del.className = 'cancelButton';
	del.addEventListener('click', function(e) {
		var list = document.getElementById('classList');
		var index = list.selectedIndex;

		classes.splice(index, 1);
		if (classes.length == 0)
		{
			newClass();
		}
		list.remove(index);
		index = Math.min(index, classes.length - 1);
		activeClass = classes[index];
		list.selectedIndex = index;
	});
	form.appendChild(del);

	var target = document.getElementById('classForm');
	target.innerHTML = '';
	target.appendChild(form);
};

/**
 * Updates the class data from the details form if it exists
 */
Class.prototype.update = function()
{
	var index;
	var list = document.getElementById('classList');
	for (var i = 0; i < classes.length; i++)
	{
		if (classes[i] == this)
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
	if (isClassNameTaken(newName)) return;
	this.data[0].value = newName;
	list[index].text = this.data[0].value;
};

/**
 * Creates and returns a save string for the class
 */
Class.prototype.getSaveString = function()
{
	var saveString = '';

	saveString += this.data[0].value + ":\n";
	for (var i = 0; i < this.data.length; i++)
	{
		if (this.data[i] instanceof AttributeValue) continue;
		saveString += this.data[i].getSaveString('  ');
	}
	saveString += '  attributes:\n';
	for (var i = 0; i < this.data.length; i++)
	{
		if (this.data[i] instanceof AttributeValue)
		{
			saveString += this.data[i].getSaveString('    ');
		}
	}
	return saveString;
};

/**
 * Loads class data from the config lines stating at the given index
 *
 * @param {YAMLObject} data - the data to load
 *
 * @returns {Number} the index of the last line of data for this class
 */
Class.prototype.load = loadSection;

/**
 * Creates a new class and switches the view to it
 *
 * @returns {Class} the new class
 */
function newClass()
{
	var id = 1;
	while (isClassNameTaken('Class ' + id)) id++;

	activeClass = addClass('Class ' + id);

	var list = document.getElementById('classList');
	list.selectedIndex = list.length - 2;

	activeClass.createFormHTML();

	return activeClass;
}

/**
 * Adds a skill to the editor without switching the view to it
 *
 * @param {string} name - the name of the skill to add
 *
 * @returns {Skill} the added skill
 */
function addClass(name)
{
	var c = new Class(name);
	classes.push(c);

	var option = document.createElement('option');
	option.text = name;
	var list = document.getElementById('classList');
	list.add(option, list.length - 1);

	return c;
}

/**
 * Checks whether or not a class name is currently taken
 *
 * @param {string} name - name to check for
 *
 * @returns {boolean} true if the name is taken, false otherwise
 */
function isClassNameTaken(name)
{
	return getClass(name) != null;
}

/**
 * Retrieves a class by name
 *
 * @param {string} name - name of the class to retrieve
 *
 * @returns {Class} the class with the given name or null if not found
 */
function getClass(name)
{
	name = name.toLowerCase();
	for (var i = 0; i < classes.length; i++)
	{
		if (classes[i].data[0].value.toLowerCase() == name) return classes[i];
	}
	return null;
}

var activeClass = new Class('职业 1');
var classes = [activeClass];
activeClass.createFormHTML();