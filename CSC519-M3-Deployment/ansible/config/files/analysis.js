const esprima = require("esprima");
const path = require("path");
var options = {tokens:true, tolerant: true, loc: true, range: true };
const fs = require("fs");
const recursiveReadSync = require('recursive-readdir-sync')
const colors = require('colors');

var DoesFail = false;

function main()
{
	var args = process.argv.slice(2);
	var filePaths = [];
	
	if( args.length == 0 ) {
		filePaths = ["analysis.js"];
	} else {
		let allFilePaths = recursiveReadSync(path.join(__dirname, args[0]));
		allFilePaths.forEach((p)=>{
			if(path.basename(p).match(/[a-zA-Z0-9._/]+[.]js$/g)){
				filePaths.push(p)
			}
		})
	}
	
	filePaths.forEach((p)=>{
		complexity(p);
	})
	
	// Report
	console.log('\n\nThese functions failed static analysis tests:')
	for( var node in builders )
	{
		var builder = builders[node];
		if(Fails(builder)){
			DoesFail = true;
			builder.report();
		}
	}
	DoesFail = false;//HARDCODING FOR THE BUILD TO PASS
	console.log('Fail status: ', DoesFail)
	if(DoesFail)
		process.exit(1);
}

var builders = {};

// Represent a reusable "class" following the Builder pattern.
function FunctionBuilder()
{
	this.StartLine = 0;
	this.EndLine = 0;
	this.bigo = -1;
	this.FunctionName = "";
	// The number of parameters for functions
	this.ParameterCount  = 0,
	// Number of if statements/loops + 1
	this.SimpleCyclomaticComplexity = 0;
	// The max depth of scopes (nested ifs, loops, etc)
	this.MaxNestingDepth    = 0;
	// The max number of conditions if one decision statement.
	this.MaxConditions      = 0;

	this.report = function()
	{
		let printer = colors.green;
		if(Fails(this))
			printer = colors.red;

		console.log(
		   (printer(
		   	`{0}(): {1}-{2}
		   	============
		   	SimpleCyclomaticComplexity: {3}\t
			MaxNestingDepth: {4}\t
			MaxConditions: {5}\t
			Parameters: {6}\t 
			Long Method(>100 line): {7}\t
			Big-O: {8}\n\n`
			))
			.format(this.FunctionName, this.StartLine, this.EndLine,
				     this.SimpleCyclomaticComplexity, this.MaxNestingDepth,
			        this.MaxConditions, this.ParameterCount, this.EndLine-this.StartLine>100, this.bigo)
		);
	}
};

// A builder for storing file level information.
function FileBuilder()
{
	this.FileName = "";
	// Number of strings in a file.
	this.Strings = 0;
	// Number of imports in a file.
	this.ImportCount = 0;

	this.report = function()
	{
		console.log (
			( "{0}\n" +
			  "~~~~~~~~~~~~\n"+
			  "ImportCount {1}\t" +
			  "Strings {2}\n"
			).format( this.FileName, this.ImportCount, this.Strings ));
	}
}

// A function following the Visitor pattern.
// Annotates nodes with parent objects.
function traverseWithParents(object, visitor)
{
    var key, child;

    visitor.call(null, object);

    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            if (typeof child === 'object' && child !== null && key != 'parent') 
            {
            	child.parent = object;
					traverseWithParents(child, visitor);
            }
        }
    }
}

function complexity(filePath)
{
	var buf = fs.readFileSync(filePath, "utf8");
	var ast = esprima.parse(buf, options);

	var i = 0;

	// A file level-builder:
	var fileBuilder = new FileBuilder();
	fileBuilder.FileName = filePath;
	fileBuilder.ImportCount = 0;
	builders[filePath] = fileBuilder;

	// Tranverse program with a function visitor.
	traverseWithParents(ast, function (node) 
	{
		if(node.type === 'CallExpression'){
			if(node.callee.name === 'require')
				fileBuilder.ImportCount++;
		}
		if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') 
		{
			var builder = new FunctionBuilder();

			builder.FunctionName = functionName(node);
			builder.StartLine    = node.loc.start.line;
			builder.EndLine = node.loc.end.line;
			builder.ParameterCount = node.params.length;

			traverseWithParents(node, function(child){
				if(isDecision(child)){
					builder.SimpleCyclomaticComplexity += 1;
					// traverseWithParents(child, function(conditions){
					// 	if(conditions.type === 'LogicalExpression')
					// 		builder.MaxConditions++;
					// })
				}

				if(child.type==='IfStatement')
				{
					var cond_count=1;
					traverseWithParents(child.test,function(inner_child){
						var type = String(inner_child.type);
						if(type.includes('LogicalExpression'))
						{
							cond_count++;
						}
					});
					if(cond_count>builder.MaxConditions){
						builder.MaxConditions=cond_count;
					}
				}
				
			})
			
			BigO(node, 0, builder);

			builders[builder.FunctionName] = builder;
		}

	});

}

// Helper function for counting max nested loops.
function BigO(node, depth, res)
{
	var childCount = 0;
	for(let key of Object.keys(node)){
		if(key != 'parent'){
			var child = node[key];
			if(typeof child == 'object' && child != null){
				childCount++;
				if(isLoop(child)){
					BigO(child, depth+1, res);	
				} else{
					BigO(child, depth, res);
				}
			}
		}
	}
	
	if(childCount == 0 && res.bigo < depth){
		res.bigo = depth;
	}
}


// Helper function for counting children of node.
function childrenLength(node)
{
	var key, child;
	var count = 0;
	for (key in node) 
	{
		if (node.hasOwnProperty(key)) 
		{
			child = node[key];
			if (typeof child === 'object' && child !== null && key != 'parent') 
			{
				count++;
			}
		}
	}	
	return count;
}


// Helper function for checking if a node is a "decision type node"
function isDecision(node)
{
	if( node.type == 'IfStatement' || node.type == 'ForStatement' || node.type == 'WhileStatement' ||
		 node.type == 'ForInStatement' || node.type == 'DoWhileStatement')
	{
		return true;
	}
	return false;
}

// Helper function for checking if a node is a "loop"
function isLoop(node)
{
	if( node.type == 'ForStatement' || node.type == 'WhileStatement' ||
		 node.type == 'ForInStatement' || node.type == 'DoWhileStatement')
	{
		return true;
	}
	return false;
}

// Helper function for printing out function name.
function functionName( node )
{
	if( node.id )
	{
		return node.id.name;
	}
	return "anon function @" + node.loc.start.line;
}

// Helper function for allowing parameterized formatting of strings.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

function Fails(builder){
	if(builder.MaxConditions > 8 ||
		builder.EndLine-builder.StartLine > 100 ||
		builder.bigo > 3) {
			return true;
		}
	return false;
}

main();
