### Help
<br/>

#### Help

There's nothing in this section yet. Maybe the next release will have something.

<br/>

#### DQL (Data Query Language)

Almost every data table in the app contains a query search bar.
The search bar accepts a query language called DQL (Data Query Language).
DQL is a simple language that allows you to search for data in a table.
The language is based on the SQL language, but it's not the same.

<br/>

##### Syntax

The syntax of the DQL language is as follows:

```text
<filter_sequence> -> <filter> | <filter> <relation> <filter_sequence>

<relation> -> and | or

<filter> -> <field_name> <operator> <expression>

<field_name> -> <string>

<operator> -> == | != | > | >= | < | <=

<expression> -> <expression_value> | <expression_value> <expr_operator> <expression>

<expr_operator> -> + | - | * | /

<expression_value> -> <string> | <number> | <boolean> | <null>
```

<br/>

##### Arithmetic operators

You can use operators between the expression values.
The following operators are supported:

| Operator | Description    |
|----------|----------------|
| +        | Add            |
| -        | Subtract       |
| *        | Multiply       |
| /        | Divide         |
| //       | Integer divide |
| %        | Modulus        |
| ^        | Power          |
| **       | Power          |

<br />

##### Comparison operators

You can use operators between the field name and the value.
The following operators are supported:

| Operator | Description           |
|----------|-----------------------|
| ==       | Equal                 |
| !=       | Not equal             |
| >        | Greater than          |
| >=       | Greater than or equal |
| <        | Less than             |
| <=       | Less than or equal    |
| ~        | Contains              |

<br/>

##### Combining filters

You can combine multiple filters using the `and` and `or` operators.

The `and` operator means that all filters must be true.

The `or` operator means that at least one filter must be true.

`and` has a higher priority than `or`.

<br/>

##### Examples

* `name == "IIS"` 
* `credits >= 5`
* `capacity > 100`
* `name == "IIS" and credits >= 5`
* `name == "IIS" or credits >= 5`
* `name == "IIS" and credits >= 5 or capacity > 10 + 20`

