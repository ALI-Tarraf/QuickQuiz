<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

use function Laravel\Prompts\error;

class BackupData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:backup {--disk=local}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

//     protected $options = [
//     ['disk', null, \Symfony\Component\Console\Input\InputOption::VALUE_OPTIONAL, 'The storage disk to save the backup', 'local'],
// ];

    /**
     * Execute the console command.
     */
    public function handle()
    {
$database = config('database.connections.mysql.database');
$username = config('database.connections.mysql.username');
$password = config('database.connections.mysql.password');
$host     = config('database.connections.mysql.host');


        $mysqldumppath = env('MYSQLDUMP_PATH','C:\\xampp\\mysql\\bin\\mysqldump.exe');

        //create the backup file name
        $date =  now()->format('Y-m-d_H-i-s');
        $filename = "backup_{$database}_{$date}.sql";
        $disk = $this->option('disk') ?? 'local';

        $storagePath = storage_path("app/{$filename}");

        //create the backup command
        $passwordPart = $password ? "-p\"{$password}\"" : '';
        $command = "\"{$mysqldumppath}\" -u {$username} {$passwordPart} -h {$host} {$database} > \"{$storagePath}\"";


        //Execute the command
        $result =  null;
        $output = null;
        exec($command,$output,$result);
        if($result !== 0){
            $this->error('Database Backup Failed.');
            return Command::FAILURE;

        }

        //use the storage facade to save the file to the specified disk
        if ($disk !== 'local'){
            Storage::disk($disk)->put($filename,file_get_contents($storagePath));
            //remove the local file after uploading to the disk
            unlink($storagePath);
        }
        $this->info("Database backup created successfully: {$filename}");
        $this->info("Backup file saved to disk: {$disk}");
        $this->info("Backup file path: {$storagePath}");
        return Command::SUCCESS;

    }
}
