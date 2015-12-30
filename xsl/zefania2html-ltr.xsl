<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="~/NJC tamil bible/bibles/bible.xml"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:output method="html" encoding="UTF-8"/>

<xsl:variable name="biblenamevar">
	<xsl:value-of  select="/XMLBIBLE/@biblename"/>
</xsl:variable>

<xsl:template match="XMLBIBLE">
  <html DIR="LTR">
    <head>
	<title><xsl:copy-of select="$biblenamevar"/></title>
	<link rel="SHORTCUT ICON" href="../images/cs_icon.ico" />
	<script type="text/javascript" src="../js/zefania.js"/>
	<link rel="stylesheet" type="text/css" href="../css/zefania-ltr.css" />
    </head>
		<body onLoad="javascript:toggledivchap()">
		
		<div id="menudiv" class="floattop1">			
		<form name="bookform1">
			<select id="book1" name="book1" onChange="javascript:toggledivchap1()">
				<xsl:apply-templates select="BIBLEBOOK" mode="allbooksmenu"/>
			</select>
		</form>
		</div>
		
		<div id="menudiv" class="floattop2">			
		<form name="bookform2">
			<select id="book2" name="book2" onChange="javascript:toggledivchap2()">
				<xsl:apply-templates select="BIBLEBOOK" mode="allbooksmenu"/>
			</select>
		</form>
		</div>
		
		<div id="menufont" class="floatfont">			
			<a href="javascript:;"><img border="0" src="../images/size_big.gif" onClick="increaseSize()"/></a>
			<a href="javascript:;"><img border="0" src="../images/size_medium.gif" onClick="defaultSize()"/></a>
			<a href="javascript:;"><img border="0" src="../images/size_small.gif" onClick="decreaseSize()"/></a>	
			<a href="javascript:;"></a>	
		</div>
		
		<div id="divsearch" class="floatsearch">			
		
		</div>
		
		<xsl:apply-templates select="BIBLEBOOK" mode="menubook"/>
		
		<xsl:apply-templates select="BIBLEBOOK" mode="divbook"/>
		
		<div id="divsearchresults" class="searchresults">
			<p>Search Results...</p>
		</div>
		
		</body>
    </html>
  </xsl:template>
  
<xsl:template mode="menubook" match="BIBLEBOOK">
	<div id="menu1_{@bnumber}" class="floatleft">		
				<ul id="menus_book1" class="treeview">
					<xsl:apply-templates select="CHAPTER" mode="menuchapter1"/>
				</ul>
		<script type="text/javascript">
			ddtreemenu.createTree('menus_book1', true);
		</script>
	</div>
	
	<div id="menu2_{@bnumber}" class="floatright">		
				<ul id="menus_book2" class="treeview">
					<xsl:apply-templates select="CHAPTER" mode="menuchapter2"/>
				</ul>
		<script type="text/javascript">
			ddtreemenu.createTree('menus_book2', true);
		</script>
	</div>
	
</xsl:template>
  
<xsl:template mode="allbooksmenu" match="BIBLEBOOK">
	<option value="{@bnumber}"><xsl:value-of select="@bname"/></option>
</xsl:template>  
  
<xsl:template mode="divbook" match="BIBLEBOOK">
	<xsl:apply-templates select="CHAPTER" mode="divchapter1"/>				
	<xsl:apply-templates select="CHAPTER" mode="divchapter2"/>			
</xsl:template>

<xsl:template mode="divchapter1" match="CHAPTER">	
	<div id="{../@bname} {@cnumber}_L" class="chapterbody1">	
	<h1><xsl:value-of select="../@bname"/> - <xsl:value-of select="@cnumber"/></h1>
<h4>	<p>
		<xsl:apply-templates select="VERS"  mode="divverse"/>
	</p>	</h4>
	</div>
</xsl:template>  

<xsl:template mode="divchapter2" match="CHAPTER">	
	<div id="{../@bname} {@cnumber}_R" class="chapterbody2">	
	<h1><xsl:value-of select="../@bname"/> - <xsl:value-of select="@cnumber"/></h1>
	<p>
		<xsl:apply-templates select="VERS"  mode="divverse"/>
	</p>	
	</div>
</xsl:template>   
  
<xsl:template mode="divverse" match="VERS">
	<sup>
	<xsl:text> </xsl:text><br/><br/>
	<font color="#EA000D" size='10'>
    <xsl:value-of select="@vnumber"/>
	</font>
	<center><I><xsl:text> </xsl:text></I></center>
	</sup>
	<xsl:value-of select="."/>
</xsl:template>

<xsl:template mode="menuchapter1" match="CHAPTER">
	<li><a href="javascript:;" onclick="javascript:togglediv1('{../@bname} {@cnumber}_L');"><xsl:value-of select="@cnumber"/></a></li>
</xsl:template>  

<xsl:template mode="menuchapter2" match="CHAPTER">
	<li><a href="javascript:;" onclick="javascript:togglediv2('{../@bname} {@cnumber}_R');"><xsl:value-of select="@cnumber"/></a></li>
</xsl:template> 

</xsl:stylesheet>
