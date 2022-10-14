/**
 * Represents the data for a dynamic class
 *
 * @param {string} name - name of the class
 *
 * @constructor
 */ 
 var rep_ATTRIBS = {
	vitality: "生命",
    spirit: "精神",
    intelligence: "智力",
    dexterity: "灵巧",
    strength: "力量"
 }
    
;
function Class(name) 
{
	this.dataKey = 'attributes';
	this.componentKey = 'classes do not have components';
    this.attribCount = 0;
	
	// Class data
	this.data = [
		new StringValue('职业名称', 'name', name).setTooltip('职业的名称，不应该包含颜色代码'),
		new StringValue('职业聊天前缀', 'prefix', '&6' + name).setTooltip('选择这个职业的玩家的聊天前缀，可以包含颜色代码'),
		new StringValue('职业所属组', 'group', 'class').setTooltip('职业所在的组，不在同一组的职业能够同时被选择'),
		new StringValue('法力的名称', 'mana', '&2法力').setTooltip('法力值的名称'),
		new IntValue('职业最大等级', 'max-level', 40).setTooltip('这个职业的最大等级。如果出现转职，这个等级会被继承。'),
		new ListValue('父职业', 'parent', ['None'], 'None').setTooltip('能够转职为这个职业的职业，例如，战士能够转职为骑士，骑士的父职业就是战士。'),
		new ListValue('权限', 'needs-permission', ['True', 'False'], 'False').setTooltip('选择这个职业是否需要权限，如果需要，那么权限节点应该是这样："skillapi.class.{职业名称}"'),
        new ByteListValue('经验来源', 'exp-source', [ '生物 Mob', '方块破坏 Block Break', '方块放置 Block Place', '合成 Craft', '使用指令 Command', '特殊 Special', '经验瓶 Exp Bottle', '熔炼 Smelt', '任务 Quest' ], 273).setTooltip('这个职业升级经验的来源，大部分都只在config.yml use-exp-orbs激活的时候才有效。'),
		new AttributeValue('生命值', 'health', 20, 0).setTooltip('职业的生命值'),
		new AttributeValue('Mana', 'mana', 20, 0).setTooltip('职业的Mana'),
		new DoubleValue('Mana回复', 'mana-regen', 1, 0).setTooltip('每个间隔恢复的法力值. 间隔在config.yml中设置，默认为1秒.如果想设置小数请增加间隔'),
		new ListValue('技能树', 'tree', [ 'Basic Horizontal', 'Basic Vertical', 'Level Horizontal', 'Level Vertical', 'Flood', 'Requirement' ], 'Requirement'),
		new StringListValue('技能 (每行一个)', 'skills', []).setTooltip('The skills the class is able to use'),
		new ListValue('图标', 'icon', getMaterials, 'Jack O Lantern').setTooltip('The item that represents the class in GUIs'),
		new IntValue('图标数据', 'icon-data', 0).setTooltip('The data/durability value of the item that represents the class in GUIs'),
		new StringListValue('图标Lore', 'icon-lore', [
			'&d' + name
		]),
		new StringListValue('不可用物品', 'blacklist', [ ]).setTooltip('The types of items that the class cannot use (one per line)'),
		new StringValue('Action Bar', 'action-bar', '').setTooltip('The format for the action bar. Leave blank to use the default formatting.')
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
        var format = rep_ATTRIBS[attrib];
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
	let i;
	var form = document.createElement('form');
	
	var header = document.createElement('h4');
	header.innerHTML = '职业属性';
	form.appendChild(header);
	
	var h = document.createElement('hr');
	form.appendChild(h);
	
	this.data[5].list.splice(1, this.data[5].list.length - 1);
	for (i = 0; i < classes.length; i++)
	{
		if (classes[i] != this) 
		{
			this.data[5].list.push(classes[i].data[0].value);
		}
	}
	for (i = 0; i < this.data.length; i++)
	{
		this.data[i].createHTML(form);
        
        // Append attributes
        if (this.data[i].name == 'Mana')
        {
            var dragInstructions = document.createElement('label');
            dragInstructions.id = 'attribute-label';
            dragInstructions.innerHTML = '拖放属性.yml 文件以查看自定义属性';
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

var activeClass = new Class('Class 1');
var classes = [activeClass];
activeClass.createFormHTML();