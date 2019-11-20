<?php
/**
* @package    JJ_Discord
* @copyright  Copyright (C) 2011 - 2019 JoomJunk. All rights reserved.
* @license    GPL v3.0 or later https://www.gnu.org/licenses/gpl-3.0.html
*/

defined('_JEXEC') or die('Restricted access');

use Joomla\CMS\Factory;
use Joomla\CMS\HTML\HTMLHelper;
use Joomla\CMS\Uri\Uri;

HTMLHelper::_('stylesheet', 'mod_discord/mod_discord.css', ['version' => 'auto', 'relative' => true]);
HTMLHelper::_('script', 'mod_discord/mod_discord.js', ['version' => 'auto', 'relative' => true]);
?>

<h3 class="uk-panel-title page-header"><img src="<?php echo Uri::root() . 'media/mod_discord/images/logo.svg'; ?>" alt=""> Discord</h3>

<?php if (isset($server)) : ?>
	<?php if ($membersCount == 1) : ?>
		<div id="jj-discord-count" class="jj-discord-count jj-margin-small"></div>
	<?php endif; ?>

	<?php if (isset($height)) : ?>
		<div class="jj-overflow-container jj-margin" style="height:<?php echo $height; ?>px">
	<?php else : ?>
		<div class="jj-margin">
	<?php endif; ?>

		<ul id="jj-discord" class="jj-discord jj-list jj-list-line"></ul>

		<?php if ($members == 1) : ?>
			<h5>Members</h5>
			<ul id="jj-discord-members" class="jj-discord-members jj-list"></ul>
		<?php endif; ?>

	</div>

	<?php if ($connect == 1) : ?>
		<div class="clearfix uk-clearfix">
			<a href="#" id="jj-discord-connect" class="jj-float-right btn btn-primary btn-sm uk-button uk-button-primary uk-button-small" target="_blank" rel="noopener noreferrer">Connect</a>
		</div>
	<?php endif; ?>
<?php else : ?>
	<p>Please enter a Server ID</p>
<?php endif; ?>

<?php
	Factory::getDocument()->addScriptOptions(
		'discord',
		[
			'root'         => Uri::root(),
			'server'       => $server,
			'members'      => $members,
			'game'         => $game,
			'membersCount' => $membersCount,
			'connect'      => $connect
		]
	);
