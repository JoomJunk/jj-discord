<?php
/**
* @package    JJ_Discord
* @copyright  Copyright (C) 2011 - 2019 JoomJunk. All rights reserved.
* @license    GPL v3.0 or later https://www.gnu.org/licenses/gpl-3.0.html
*/

defined('_JEXEC') or die('Restricted access');

use Joomla\CMS\Helper\ModuleHelper;

$server       = $params->get('server');
$members      = $params->get('members', 1);
$game         = $params->get('game', 1);
$membersCount = $params->get('members-count', 1);
$connect      = $params->get('connect', 1);
$height       = $params->get('height', 300);

require ModuleHelper::getLayoutPath('mod_discord');
